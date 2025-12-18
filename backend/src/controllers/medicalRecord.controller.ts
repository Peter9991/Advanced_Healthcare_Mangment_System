import { Request, Response } from 'express';
import pool from '../config/database';
import { validateId } from '../utils/validation';

interface MedicalRecordWithDetails {
  record_id: number;
  patient_id: number;
  patient_name?: string;
  doctor_id: number;
  doctor_name?: string;
  record_date: string;
  record_time: string;
  chief_complaint?: string;
  assessment?: string;
}

// Get all medical records
export const getAllMedicalRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const patientId = req.query.patient_id ? validateId(req.query.patient_id as string) : null;
    const doctorId = req.query.doctor_id ? validateId(req.query.doctor_id as string) : null;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (patientId) {
      conditions.push('mr.patient_id = ?');
      params.push(patientId);
    }

    if (doctorId) {
      conditions.push('mr.doctor_id = ?');
      params.push(doctorId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM medical_records mr ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);

    const [rows] = await pool.execute(
      `SELECT 
        mr.record_id,
        mr.patient_id,
        mr.doctor_id,
        mr.record_date,
        mr.record_time,
        mr.chief_complaint,
        mr.assessment,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(s.first_name, ' ', s.last_name) as doctor_name
       FROM medical_records mr
       INNER JOIN patients p ON mr.patient_id = p.patient_id
       INNER JOIN doctors d ON mr.doctor_id = d.doctor_id
       INNER JOIN staff s ON d.staff_id = s.staff_id
       ${whereClause}
       ORDER BY mr.record_date DESC, mr.record_time DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      params
    );
    const records = rows as MedicalRecordWithDetails[];

    res.json({
      success: true,
      data: {
        data: records,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch medical records' });
  }
};

// Get medical record by ID
export const getMedicalRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recordId = validateId(id);

    if (!recordId) {
      res.status(400).json({ success: false, message: 'Invalid record ID' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT 
        mr.record_id,
        mr.patient_id,
        mr.visit_id,
        mr.doctor_id,
        mr.record_date,
        mr.record_time,
        mr.chief_complaint,
        mr.history_of_present_illness,
        mr.physical_examination,
        mr.assessment,
        mr.plan,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(s.first_name, ' ', s.last_name) as doctor_name
       FROM medical_records mr
       INNER JOIN patients p ON mr.patient_id = p.patient_id
       INNER JOIN doctors d ON mr.doctor_id = d.doctor_id
       INNER JOIN staff s ON d.staff_id = s.staff_id
       WHERE mr.record_id = ?`,
      [recordId]
    );
    const records = rows as any[];

    if (records.length === 0) {
      res.status(404).json({ success: false, message: 'Medical record not found' });
      return;
    }

    res.json({ success: true, data: records[0] });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch medical record' });
  }
};

