import { Request, Response } from 'express';
import pool from '../config/database';

interface PrescriptionWithDetails {
  prescription_id: number;
  patient_id: number;
  patient_name?: string;
  doctor_id: number;
  doctor_name?: string;
  prescription_date: string;
  status: string;
  refills_remaining?: number;
  instructions?: string;
}

// Get all prescriptions
export const getAllPrescriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM prescriptions'
    );
    const total = (countResult as any[])[0].total;

    // Get prescriptions with patient and doctor names
    const [rows] = await pool.execute(
      `SELECT 
        pr.prescription_id,
        pr.patient_id,
        pr.doctor_id,
        pr.prescription_date,
        pr.status,
        pr.refills_remaining,
        pr.instructions,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(s.first_name, ' ', s.last_name) as doctor_name
       FROM prescriptions pr
       INNER JOIN patients p ON pr.patient_id = p.patient_id
       INNER JOIN doctors d ON pr.doctor_id = d.doctor_id
       INNER JOIN staff s ON d.staff_id = s.staff_id
       ORDER BY pr.prescription_date DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`
    );
    const prescriptions = rows as PrescriptionWithDetails[];

    res.json({
      success: true,
      data: {
        data: prescriptions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch prescriptions' });
  }
};

// Create new prescription
export const createPrescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient_id, doctor_id, prescription_date, status, instructions, refills_allowed, refills_remaining, expiry_date } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO prescriptions (
        patient_id, doctor_id, prescription_date, status, 
        instructions, refills_allowed, refills_remaining, expiry_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        doctor_id,
        prescription_date,
        status || 'Active',
        instructions || null,
        refills_allowed || 0,
        refills_remaining || refills_allowed || 0,
        expiry_date || null
      ]
    );

    const insertResult = result as any;
    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescription_id: insertResult.insertId }
    });
  } catch (error: any) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ success: false, message: 'Failed to create prescription' });
  }
};
