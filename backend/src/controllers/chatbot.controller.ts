import { Request, Response } from 'express';
import pool from '../config/database';
import { getGroqResponse, getAvailableDoctorsForContext } from '../services/groq.service';

interface ChatbotRequest {
  message: string;
}

interface ChatbotResponse {
  message: string;
  action?: {
    type: 'book_appointment';
    data: {
      doctor_id: number;
      doctor_name: string;
      appointment_date: string;
      appointment_time: string;
      reason?: string;
    };
  };
}

// Simple NLP functions to extract intent from user message
const extractIntent = (message: string): {
  intent: 'book_appointment' | 'medical_question' | 'greeting' | 'unknown';
  doctorName?: string;
  time?: string;
  date?: string;
  symptom?: string;
} => {
  const lowerMessage = message.toLowerCase();
  
  // Check for appointment booking intent
  const bookingKeywords = ['book', 'appointment', 'schedule', 'reserve', 'حجز', 'موعد', 'حجز موعد'];
  const isBooking = bookingKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isBooking) {
    // Extract doctor name
    const doctorMatch = lowerMessage.match(/(?:dr|doctor|دكتور|د\.?)\s*([a-z\s]+)/i);
    const doctorName = doctorMatch ? doctorMatch[1].trim() : undefined;
    
    // Extract time
    const timeMatch = lowerMessage.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|ص|م)?/i);
    const time = timeMatch ? timeMatch[0] : undefined;
    
    // Extract date
    let date: string | undefined;
    if (lowerMessage.includes('tomorrow') || lowerMessage.includes('غداً')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    } else if (lowerMessage.includes('today') || lowerMessage.includes('اليوم')) {
      date = new Date().toISOString().split('T')[0];
    } else {
      // Try to extract date patterns
      const dateMatch = lowerMessage.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dateMatch) {
        date = dateMatch[0];
      }
    }
    
    return {
      intent: 'book_appointment',
      doctorName,
      time,
      date
    };
  }
  
  // Check for medical question
  const medicalKeywords = ['pain', 'ache', 'hurt', 'symptom', 'feel', 'problem', 'ألم', 'وجع', 'أشعر', 'مشكلة'];
  const isMedical = medicalKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isMedical) {
    // Extract symptom
    const symptomKeywords = ['stomach', 'head', 'chest', 'back', 'tooth', 'بطن', 'رأس', 'صدر', 'ظهر', 'أسنان'];
    const symptom = symptomKeywords.find(keyword => lowerMessage.includes(keyword));
    
    return {
      intent: 'medical_question',
      symptom
    };
  }
  
  // Check for greeting
  const greetingKeywords = ['hello', 'hi', 'hey', 'مرحبا', 'أهلا', 'سلام'];
  const isGreeting = greetingKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isGreeting) {
    return { intent: 'greeting' };
  }
  
  return { intent: 'unknown' };
};

// Find doctor by name
const findDoctorByName = async (name: string): Promise<any> => {
  try {
    const searchPattern = `%${name}%`;
    const [rows] = await pool.execute(
      `SELECT d.doctor_id, CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
              ds.specialty_name, d.consultation_fee
       FROM doctors d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       WHERE s.first_name LIKE ? OR s.last_name LIKE ? OR CONCAT(s.first_name, ' ', s.last_name) LIKE ?
       LIMIT 1`,
      [searchPattern, searchPattern, searchPattern]
    );
    
    const doctors = rows as any[];
    return doctors.length > 0 ? doctors[0] : null;
  } catch (error) {
    console.error('Error finding doctor:', error);
    return null;
  }
};

// Check doctor availability
const checkDoctorAvailability = async (doctorId: number, date: string, time: string): Promise<boolean> => {
  try {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM appointments
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status_id IN (1, 2)`,
      [doctorId, date, time]
    );
    
    const result = rows as any[];
    return result[0].count === 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
};

// Find alternative doctor for symptom
const findDoctorBySymptom = async (symptom: string): Promise<any> => {
  try {
    // Map symptoms to specialties
    const symptomSpecialtyMap: Record<string, string> = {
      'stomach': 'Gastroenterology',
      'بطن': 'Gastroenterology',
      'head': 'Neurology',
      'رأس': 'Neurology',
      'chest': 'Cardiology',
      'صدر': 'Cardiology',
      'back': 'Orthopedics',
      'ظهر': 'Orthopedics',
      'tooth': 'Dentistry',
      'أسنان': 'Dentistry'
    };
    
    const specialty = symptomSpecialtyMap[symptom.toLowerCase()] || 'General Medicine';
    
    const [rows] = await pool.execute(
      `SELECT d.doctor_id, CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
              ds.specialty_name, d.consultation_fee
       FROM doctors d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       WHERE ds.specialty_name LIKE ? OR ds.specialty_name = 'General Medicine'
       LIMIT 1`,
      [`%${specialty}%`]
    );
    
    const doctors = rows as any[];
    return doctors.length > 0 ? doctors[0] : null;
  } catch (error) {
    console.error('Error finding doctor by symptom:', error);
    return null;
  }
};

// Get available time slots for tomorrow
const getAvailableTimeSlots = (): string[] => {
  return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
};

// Main chatbot message handler
export const handleChatbotMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message }: ChatbotRequest = req.body;
    
    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }
    
    // Get available doctors for AI context
    const availableDoctors = await getAvailableDoctorsForContext();
    
    // Try to get AI-powered response first (for better natural language understanding)
    let groqResponse;
    try {
      groqResponse = await getGroqResponse(message, { availableDoctors });
    } catch (error) {
      console.warn('⚠️  Groq API failed, using rule-based fallback:', error);
    }
    
    // Use rule-based intent extraction for structured data (appointments)
    const intent = extractIntent(message);
    let response: ChatbotResponse;
    
    if (intent.intent === 'book_appointment') {
      // Try to find the requested doctor
      let doctor = null;
      if (intent.doctorName) {
        doctor = await findDoctorByName(intent.doctorName);
      }
      
      // If doctor not found or not specified, find any available doctor
      if (!doctor) {
        const [allDoctors] = await pool.execute(
          `SELECT d.doctor_id, CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
                  ds.specialty_name
           FROM doctors d
           INNER JOIN staff s ON d.staff_id = s.staff_id
           LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
           WHERE d.status = 'Active'
           LIMIT 5`
        );
        const doctors = allDoctors as any[];
        doctor = doctors.length > 0 ? doctors[0] : null;
      }
      
      if (!doctor) {
        response = {
          message: 'I\'m sorry, but no doctors are currently available. Please contact our reception for assistance.'
        };
      } else {
        // Determine date (default to tomorrow)
        const appointmentDate = intent.date || (() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString().split('T')[0];
        })();
        
        // Determine time (default to 13:00 or first available)
        const requestedTime = intent.time || '13:00';
        const timeSlots = getAvailableTimeSlots();
        let appointmentTime = requestedTime;
        
        // Check if requested time is available
        const isAvailable = await checkDoctorAvailability(
          doctor.doctor_id,
          appointmentDate,
          appointmentTime + ':00'
        );
        
        if (!isAvailable) {
          // Find alternative time
          for (const slot of timeSlots) {
            const available = await checkDoctorAvailability(
              doctor.doctor_id,
              appointmentDate,
              slot + ':00'
            );
            if (available) {
              appointmentTime = slot;
              break;
            }
          }
        }
        
        // If original doctor requested but not available, suggest alternative
        if (intent.doctorName && !isAvailable && appointmentTime !== requestedTime) {
          const [alternativeDoctors] = await pool.execute(
            `SELECT d.doctor_id, CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
                    ds.specialty_name
             FROM doctors d
             INNER JOIN staff s ON d.staff_id = s.staff_id
             LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
             WHERE d.status = 'Active' AND d.doctor_id != ?
             LIMIT 1`,
            [doctor.doctor_id]
          );
          const alternatives = alternativeDoctors as any[];
          
          if (alternatives.length > 0) {
            const altDoctor = alternatives[0];
            response = {
              message: `Dr. ${intent.doctorName} isn't available tomorrow at ${requestedTime}. Would you like me to book with Dr. ${altDoctor.doctor_name} instead at ${appointmentTime}?`,
              action: {
                type: 'book_appointment',
                data: {
                  doctor_id: altDoctor.doctor_id,
                  doctor_name: altDoctor.doctor_name,
                  appointment_date: appointmentDate,
                  appointment_time: appointmentTime,
                  reason: message
                }
              }
            };
          } else {
            response = {
              message: `Dr. ${intent.doctorName} isn't available tomorrow at ${requestedTime}. Would you like me to book with Dr. ${doctor.doctor_name} at ${appointmentTime}?`,
              action: {
                type: 'book_appointment',
                data: {
                  doctor_id: doctor.doctor_id,
                  doctor_name: doctor.doctor_name,
                  appointment_date: appointmentDate,
                  appointment_time: appointmentTime,
                  reason: message
                }
              }
            };
          }
        } else {
          response = {
            message: `Great! I can book an appointment with Dr. ${doctor.doctor_name} on ${appointmentDate} at ${appointmentTime}. Would you like me to proceed?`,
            action: {
              type: 'book_appointment',
              data: {
                doctor_id: doctor.doctor_id,
                doctor_name: doctor.doctor_name,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                reason: message
              }
            }
          };
        }
      }
    } else if (intent.intent === 'medical_question') {
      // Find appropriate doctor for the symptom
      let doctor = null;
      if (intent.symptom) {
        doctor = await findDoctorBySymptom(intent.symptom);
      }
      
      if (doctor) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const appointmentDate = tomorrow.toISOString().split('T')[0];
        const appointmentTime = '10:00';
        
        response = {
          message: `Yes, I can help! For ${intent.symptom} problems, I recommend booking with Dr. ${doctor.doctor_name} who specializes in ${doctor.specialty_name || 'General Medicine'}. Would you like me to book an appointment for tomorrow at ${appointmentTime}?`,
          action: {
            type: 'book_appointment',
            data: {
              doctor_id: doctor.doctor_id,
              doctor_name: doctor.doctor_name,
              appointment_date: appointmentDate,
              appointment_time: appointmentTime,
              reason: message
            }
          }
        };
      } else {
        response = {
          message: 'I understand you\'re experiencing some discomfort. I recommend booking an appointment with one of our doctors. Would you like me to help you find an available doctor?'
        };
      }
    } else if (intent.intent === 'greeting') {
      // Use Groq AI response if available, otherwise use default
      response = {
        message: groqResponse?.message || 'Hello! I\'m here to help you. You can ask me to book an appointment, ask medical questions, or get general information. How can I assist you today?'
      };
    } else {
      // Use Groq AI response for general inquiries, otherwise use default
      response = {
        message: groqResponse?.message || 'I\'m here to help! You can ask me to book an appointment with a doctor, ask medical questions, or get information about our services. What would you like to do?'
      };
    }
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error handling chatbot message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chatbot message'
    });
  }
};

