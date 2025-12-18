import { Request, Response } from 'express';
import pool from '../config/database';
import jwt from 'jsonwebtoken';

interface PatientLoginRequest {
  national_id?: string;
  email?: string;
  password: string;
}

// Patient login controller
export const patientLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { national_id, email, password }: PatientLoginRequest = req.body;

    if (!password || (!national_id && !email)) {
      res.status(400).json({ success: false, message: 'National ID or Email and password are required' });
      return;
    }

    // Find patient by national_id or email
    let query = 'SELECT patient_id, national_id, first_name, last_name, email, status FROM patients WHERE ';
    let params: any[] = [];
    
    if (national_id) {
      query += 'national_id = ?';
      params.push(national_id);
    } else if (email) {
      query += 'email = ?';
      params.push(email);
    }

    const [rows] = await pool.execute(query, params);
    const patient = (rows as any[])[0];

    if (!patient) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check if patient is active
    if (patient.status !== 'Active') {
      res.status(403).json({ success: false, message: 'Account is not active' });
      return;
    }

    // Password validation bypassed for testing (same as staff login)
    // In production, implement password hashing

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const jwtExpire = process.env.JWT_EXPIRE || '7d';
    
    const payload = {
      patient_id: patient.patient_id,
      national_id: patient.national_id,
      email: patient.email,
      user_type: 'patient'
    };
    
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire } as jwt.SignOptions);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          patient_id: patient.patient_id,
          national_id: patient.national_id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          email: patient.email,
          user_type: 'patient'
        }
      }
    });
  } catch (error) {
    console.error('Error during patient login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Get current patient info
export const getCurrentPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = (req as any).user?.patient_id;

    if (!patientId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT patient_id, national_id, first_name, last_name, middle_name, 
              email, phone, date_of_birth, gender, blood_type, status
       FROM patients
       WHERE patient_id = ?`,
      [patientId]
    );
    const patients = rows as any[];

    if (patients.length === 0) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    res.json({
      success: true,
      data: patients[0]
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch patient' });
  }
};

