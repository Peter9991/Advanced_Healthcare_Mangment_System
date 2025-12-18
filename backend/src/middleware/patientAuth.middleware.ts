import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface PatientAuthRequest extends Request {
  user?: {
    patient_id: number;
    national_id: string;
    email?: string;
    user_type: string;
  };
}

// Patient JWT Authentication Middleware
export const authenticatePatient = async (req: PatientAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Verify it's a patient token
    if (decoded.user_type !== 'patient') {
      res.status(403).json({ success: false, message: 'Invalid token type' });
      return;
    }

    req.user = {
      patient_id: decoded.patient_id,
      national_id: decoded.national_id,
      email: decoded.email,
      user_type: 'patient'
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

