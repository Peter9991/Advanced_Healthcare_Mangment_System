import { Request, Response } from 'express';
import pool from '../config/database';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';
// import bcrypt from 'bcryptjs'; // Uncomment when implementing password hashing

interface LoginRequest {
  email: string;
  password: string;
}

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    // Find staff by email
    // Note: password column doesn't exist yet - password authentication not implemented
    const [rows] = await pool.execute(
      'SELECT staff_id, employee_id, email, role_id, status FROM staff WHERE email = ?',
      [email]
    );
    const staff = (rows as any[])[0];

    if (!staff) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check if staff is active
    if (staff.status !== 'Active') {
      res.status(403).json({ success: false, message: 'Account is not active' });
      return;
    }

    // In a real app, you'd verify the password hash here
    // For now, this is a placeholder - you'll need to implement password hashing on registration
    // const isPasswordValid = await bcrypt.compare(password, staff.password);
    // if (!isPasswordValid) {
    //   res.status(401).json({ success: false, message: 'Invalid credentials' });
    //   return;
    // }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const jwtExpire = process.env.JWT_EXPIRE || '7d';
    
    if (!process.env.JWT_SECRET || jwtSecret === 'your-secret-key') {
      console.warn('⚠️  Using default JWT secret. Set JWT_SECRET in .env for production!');
    }
    
    const payload = {
      staff_id: staff.staff_id,
      role_id: staff.role_id,
      email: staff.email
    };
    
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire } as jwt.SignOptions);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          staff_id: staff.staff_id,
          employee_id: staff.employee_id,
          email: staff.email,
          role_id: staff.role_id
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Get current user info
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Get full staff details
    const [rows] = await pool.execute(
      `SELECT s.staff_id, s.employee_id, s.first_name, s.last_name, s.email, s.phone,
              s.role_id, sr.role_name, s.department_id, d.department_name, s.status,
              doc.doctor_id
       FROM staff s
       LEFT JOIN staff_roles sr ON s.role_id = sr.role_id
       LEFT JOIN departments d ON s.department_id = d.department_id
       LEFT JOIN doctors doc ON s.staff_id = doc.staff_id
       WHERE s.staff_id = ?`,
      [req.user.staff_id]
    );
    const staff = (rows as any[])[0];

    if (!staff) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        staff_id: staff.staff_id,
        employee_id: staff.employee_id,
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        phone: staff.phone,
        role_id: staff.role_id,
        role_name: staff.role_name,
        department_id: staff.department_id,
        department_name: staff.department_name,
        status: staff.status,
        doctor_id: staff.doctor_id || null
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

