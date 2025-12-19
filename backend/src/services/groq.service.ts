import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export interface GroqResponse {
  message: string;
  intent?: {
    type: 'book_appointment' | 'medical_question' | 'greeting' | 'general_inquiry' | 'unknown';
    doctorName?: string;
    time?: string;
    date?: string;
    symptom?: string;
    extractedData?: Record<string, any>;
  };
}

/**
 * Enhanced chatbot response using Groq AI
 * Falls back to simple response if API fails
 */
export const getGroqResponse = async (
  userMessage: string,
  context?: {
    availableDoctors?: Array<{ doctor_id: number; doctor_name: string; specialty_name?: string }>;
    patientName?: string;
  }
): Promise<GroqResponse> => {
  // Check if API key is configured
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === '') {
    console.warn('⚠️  Groq API key not configured, using fallback');
    return {
      message: 'I\'m here to help! You can ask me to book an appointment, ask medical questions, or get information about our services.'
    };
  }

  try {
    // Build system prompt with context
    const systemPrompt = `You are a helpful medical assistant chatbot for a healthcare management system. Your role is to:
1. Help patients book appointments with doctors
2. Answer medical questions (with appropriate disclaimers)
3. Provide general information about the healthcare system

Available doctors: ${context?.availableDoctors?.map(d => d.doctor_name).join(', ') || 'Various specialists'}

When a patient wants to book an appointment:
- Extract doctor name (if mentioned)
- Extract date (tomorrow, today, or specific date)
- Extract time (if mentioned)
- Be friendly and helpful
- If doctor/time not available, suggest alternatives

When a patient asks medical questions:
- Provide helpful but general guidance
- Always recommend booking an appointment for proper medical evaluation
- Include disclaimer that this is not a substitute for professional medical advice

Respond in a friendly, professional, and concise manner. If the user's language appears to be Arabic, respond in Arabic. Otherwise, respond in English.`;

    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      {
        role: 'user' as const,
        content: userMessage
      }
    ];

    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Using a fast and capable model
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Try to extract structured data from AI response
    const intent = extractIntentFromAIResponse(userMessage, aiResponse);

    return {
      message: aiResponse,
      intent
    };
  } catch (error: any) {
    console.error('❌ Groq API error:', error.message);
    // Fallback to simple response
    return {
      message: 'I\'m here to help! You can ask me to book an appointment, ask medical questions, or get information about our services.'
    };
  }
};

/**
 * Extract intent and structured data from user message and AI response
 * This helps bridge AI understanding with our booking system
 */
const extractIntentFromAIResponse = (
  userMessage: string,
  aiResponse: string
): GroqResponse['intent'] => {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  // Check for appointment booking
  if (
    lowerMessage.includes('book') ||
    lowerMessage.includes('appointment') ||
    lowerMessage.includes('schedule') ||
    lowerMessage.includes('حجز') ||
    lowerMessage.includes('موعد') ||
    lowerResponse.includes('book') ||
    lowerResponse.includes('appointment')
  ) {
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
    }

    return {
      type: 'book_appointment',
      doctorName,
      time,
      date
    };
  }

  // Check for medical question
  if (
    lowerMessage.includes('pain') ||
    lowerMessage.includes('ache') ||
    lowerMessage.includes('hurt') ||
    lowerMessage.includes('symptom') ||
    lowerMessage.includes('feel') ||
    lowerMessage.includes('problem') ||
    lowerMessage.includes('ألم') ||
    lowerMessage.includes('وجع') ||
    lowerMessage.includes('أشعر')
  ) {
    const symptomKeywords = ['stomach', 'head', 'chest', 'back', 'tooth', 'بطن', 'رأس', 'صدر', 'ظهر', 'أسنان'];
    const symptom = symptomKeywords.find(keyword => lowerMessage.includes(keyword));

    return {
      type: 'medical_question',
      symptom
    };
  }

  // Check for greeting
  if (
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hey') ||
    lowerMessage.includes('مرحبا') ||
    lowerMessage.includes('أهلا')
  ) {
    return {
      type: 'greeting'
    };
  }

  return {
    type: 'general_inquiry'
  };
};

/**
 * Get available doctors for context
 */
export const getAvailableDoctorsForContext = async (): Promise<
  Array<{ doctor_id: number; doctor_name: string; specialty_name?: string }>
> => {
  try {
    const pool = (await import('../config/database')).default;
    const [rows] = await pool.execute(
      `SELECT d.doctor_id, CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
              ds.specialty_name
       FROM doctors d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       WHERE d.status = 'Active'
       LIMIT 10`
    );

    return (rows as any[]).map((row: any) => ({
      doctor_id: row.doctor_id,
      doctor_name: row.doctor_name,
      specialty_name: row.specialty_name
    }));
  } catch (error) {
    console.error('Error fetching doctors for context:', error);
    return [];
  }
};

