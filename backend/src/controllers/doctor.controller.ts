import { Request, Response } from 'express';
import pool from '../config/database';
import { Doctor, DoctorWithDetails } from '../types/doctor.types';

const validateId = (id: string): number | null => {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0 ? numId : null;
};

// Get all doctors with details
export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'Active';
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status !== 'All') {
      conditions.push('d.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push(
        '(s.first_name LIKE ? OR s.last_name LIKE ? OR d.license_number LIKE ? OR ds.specialty_name LIKE ?)'
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM doctors d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    const [rows] = await pool.execute(
      `SELECT 
        d.doctor_id, d.license_number, d.years_of_experience, d.consultation_fee,
        d.bio, d.status,
        s.first_name, s.last_name, s.email, s.phone,
        ds.specialty_name, ds.specialty_id,
        dept.department_name
       FROM doctors d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       LEFT JOIN departments dept ON ds.department_id = dept.department_id
       ${whereClause}
       ORDER BY s.last_name, s.first_name
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const doctors = rows as DoctorWithDetails[];

    res.json({
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctorId = validateId(id);

    if (!doctorId) {
      res.status(400).json({ success: false, message: 'Invalid doctor ID' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT 
        d.doctor_id, d.license_number, d.years_of_experience, d.consultation_fee,
        d.bio, d.status,
        s.first_name, s.last_name, s.email, s.phone,
        ds.specialty_name, ds.specialty_id,
        dept.department_name
       FROM doctors d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN doctor_specialties ds ON d.specialization_id = ds.specialty_id
       LEFT JOIN departments dept ON ds.department_id = dept.department_id
       WHERE d.doctor_id = ?`,
      [doctorId]
    );
    const doctors = rows as DoctorWithDetails[];

    if (doctors.length === 0) {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }

    res.json({ success: true, data: doctors[0] });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch doctor' });
  }
};

