import { z } from 'zod';

// Appointment creation schema
export const createAppointmentSchema = z.object({
  patient_id: z.coerce.number().int().positive('Patient ID must be a positive number'),
  doctor_id: z.coerce.number().int().positive('Doctor ID must be a positive number'),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  appointment_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format'),
  appointment_type_id: z.coerce.number().int().positive('Appointment type ID must be a positive number'),
  status_id: z.coerce.number().int().positive('Status ID must be a positive number'),
  reason_for_visit: z.string().max(500).optional().nullable(),
  notes: z.string().max(1000).optional().nullable()
});

// Query parameters schema for appointments list
export const getAppointmentsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  doctor_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  patient_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional()
});

// Appointment ID parameter schema
export const appointmentIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Appointment ID must be a number')
});

