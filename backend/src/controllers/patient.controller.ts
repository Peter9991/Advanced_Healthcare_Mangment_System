import { Request, Response } from 'express';
import pool from '../config/database';
import { Patient, PatientCreateRequest, PatientUpdateRequest } from '../types/patient.types';

// Whitelist of allowed fields for updates
const ALLOWED_UPDATE_FIELDS = new Set([
  'first_name',
  'last_name',
  'middle_name',
  'phone',
  'email',
  'address',
  'city',
  'country',
  'postal_code',
  'marital_status',
  'occupation',
  'blood_type',
  'gender',
  'date_of_birth',
  'status'
]);

// Fields to return (exclude sensitive/internal fields)
const PATIENT_SELECT_FIELDS = `
  patient_id, national_id, passport_number, first_name, last_name, middle_name,
  date_of_birth, gender, blood_type, phone, email, address, city, country,
  postal_code, marital_status, occupation, registration_date, status,
  created_at, updated_at
`;

// Validate ID is a number
const validateId = (id: string): number | null => {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0 ? numId : null;
};

// Get all patients with pagination, search, and status filter
export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'Active';
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    // Status filter (default to Active, but allow filtering)
    if (status === 'All') {
      // Show all statuses
    } else {
      conditions.push('status = ?');
      params.push(status);
    }

    // Search filter (name, national_id, phone, email)
    if (search) {
      conditions.push(
        '(first_name LIKE ? OR last_name LIKE ? OR national_id LIKE ? OR phone LIKE ? OR email LIKE ?)'
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM patients ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    // Get patients
    // LIMIT and OFFSET must be integers in SQL string (not parameters)
    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);
    const [rows] = await pool.execute(
      `SELECT ${PATIENT_SELECT_FIELDS} 
       FROM patients 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      params
    );
    const patients = rows as Patient[];

    res.json({
      success: true,
      data: {
        data: patients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch patients' });
  }
};

// Get patient by ID
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patientId = validateId(id);

    if (!patientId) {
      res.status(400).json({ success: false, message: 'Invalid patient ID' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT ${PATIENT_SELECT_FIELDS} FROM patients WHERE patient_id = ?`,
      [patientId]
    );
    const patients = rows as Patient[];

    if (patients.length === 0) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    res.json({ success: true, data: patients[0] });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch patient' });
  }
};

// Create new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation is handled by middleware, so req.body is already validated
    const patientData: PatientCreateRequest = req.body;

    const [result] = await pool.execute(
      `INSERT INTO patients (
        national_id, passport_number, first_name, last_name, middle_name,
        date_of_birth, gender, blood_type, phone, email, address,
        city, country, postal_code, marital_status, occupation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientData.national_id,
        patientData.passport_number || null,
        patientData.first_name,
        patientData.last_name,
        patientData.middle_name || null,
        patientData.date_of_birth,
        patientData.gender,
        patientData.blood_type || null,
        patientData.phone || null,
        patientData.email || null,
        patientData.address || null,
        patientData.city || null,
        patientData.country || null,
        patientData.postal_code || null,
        patientData.marital_status || null,
        patientData.occupation || null
      ]
    );

    const insertResult = result as any;
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient_id: insertResult.insertId }
    });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ success: false, message: 'Patient with this national_id already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to create patient' });
    }
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patientId = validateId(id);

    if (!patientId) {
      res.status(400).json({ success: false, message: 'Invalid patient ID' });
      return;
    }

    const updateData: PatientUpdateRequest = req.body;

    // Build dynamic update query using whitelist
    const fields: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && ALLOWED_UPDATE_FIELDS.has(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      res.status(400).json({ success: false, message: 'No valid fields to update' });
      return;
    }

    values.push(patientId);
    const query = `UPDATE patients SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE patient_id = ?`;

    const [result] = await pool.execute(query, values);
    const updateResult = result as any;

    if (updateResult.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ success: false, message: 'Failed to update patient' });
  }
};

// Delete patient (soft delete - set status to Inactive)
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patientId = validateId(id);

    if (!patientId) {
      res.status(400).json({ success: false, message: 'Invalid patient ID' });
      return;
    }

    const [result] = await pool.execute(
      'UPDATE patients SET status = "Inactive", updated_at = CURRENT_TIMESTAMP WHERE patient_id = ?',
      [patientId]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ success: false, message: 'Failed to delete patient' });
  }
};
