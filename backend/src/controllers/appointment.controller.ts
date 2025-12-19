import { Request, Response } from 'express';
import pool from '../config/database';
import { Appointment, AppointmentWithDetails } from '../types/appointment.types';

const validateId = (id: string): number | null => {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0 ? numId : null;
};

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
    const doctorId = req.query.doctor_id ? validateId(req.query.doctor_id as string) : null;
    const patientId = req.query.patient_id ? validateId(req.query.patient_id as string) : null;
    const date = req.query.date as string;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (doctorId) {
      conditions.push('a.doctor_id = ?');
      params.push(doctorId);
    }

    if (patientId) {
      conditions.push('a.patient_id = ?');
      params.push(patientId);
    }

    if (date) {
      conditions.push('DATE(a.appointment_date) = ?');
      params.push(date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM appointments a ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    // LIMIT and OFFSET must be integers in SQL string (not parameters)
    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);
    const [rows] = await pool.execute(
      `SELECT 
        a.appointment_id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time,
        a.reason_for_visit, a.notes,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
        at.type_name as appointment_type, at.fee as appointment_fee,
        ast.status_name as status_name,
        ds.specialty_name
       FROM appointments a
       INNER JOIN patients p ON a.patient_id = p.patient_id
       INNER JOIN doctors d ON a.doctor_id = d.doctor_id
       INNER JOIN staff s ON d.staff_id = s.staff_id
       INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
       INNER JOIN appointment_status ast ON a.status_id = ast.status_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       ${whereClause}
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      params
    );
    const appointments = rows as AppointmentWithDetails[];

    res.json({
      success: true,
      data: {
        data: appointments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointmentId = validateId(id);

    if (!appointmentId) {
      res.status(400).json({ success: false, message: 'Invalid appointment ID' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT 
        a.appointment_id, a.appointment_date, a.appointment_time,
        a.reason_for_visit, a.notes,
        a.patient_id, a.doctor_id,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(s.first_name, ' ', s.last_name) as doctor_name,
        at.type_name as appointment_type, at.fee as appointment_fee,
        ast.status_name as status_name,
        ds.specialty_name
       FROM appointments a
       INNER JOIN patients p ON a.patient_id = p.patient_id
       INNER JOIN doctors d ON a.doctor_id = d.doctor_id
       INNER JOIN staff s ON d.staff_id = s.staff_id
       INNER JOIN appointment_types at ON a.appointment_type_id = at.type_id
       INNER JOIN appointment_status ast ON a.status_id = ast.status_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       WHERE a.appointment_id = ?`,
      [appointmentId]
    );
    const appointments = rows as AppointmentWithDetails[];

    if (appointments.length === 0) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }

    res.json({ success: true, data: appointments[0] });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointment' });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation is handled by middleware, so req.body is already validated
    const appointmentData: Appointment = req.body;

    const [result] = await pool.execute(
      `INSERT INTO appointments (
        patient_id, doctor_id, appointment_date, appointment_time,
        appointment_type_id, status_id, reason_for_visit, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointmentData.patient_id,
        appointmentData.doctor_id,
        appointmentData.appointment_date,
        appointmentData.appointment_time,
        appointmentData.appointment_type_id,
        appointmentData.status_id,
        appointmentData.reason_for_visit || null,
        appointmentData.notes || null
      ]
    );

    const insertResult = result as any;
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment_id: insertResult.insertId }
    });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to create appointment' });
  }
};

