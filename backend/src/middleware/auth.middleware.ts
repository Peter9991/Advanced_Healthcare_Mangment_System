import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    staff_id: number;
    role_id: number;
    role_name?: string;
    email: string;
  };
}

// JWT Authentication Middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Fetch role_name from database (optional - can be loaded later in authorize)
    try {
      const [roleRows] = await pool.execute(
        'SELECT role_name FROM staff_roles WHERE role_id = ?',
        [decoded.role_id]
      );
      const roleData = (roleRows as any[])[0];

      req.user = {
        staff_id: decoded.staff_id,
        role_id: decoded.role_id,
        role_name: roleData?.role_name,
        email: decoded.email
      };
    } catch (dbError) {
      // If role fetch fails, still set user but without role_name
      req.user = {
        staff_id: decoded.staff_id,
        role_id: decoded.role_id,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // If role_name not loaded, fetch it from database
      if (!req.user.role_name) {
        const [roleRows] = await pool.execute(
          'SELECT role_name FROM staff_roles WHERE role_id = ?',
          [req.user.role_id]
        );
        const roleData = (roleRows as any[])[0];
        req.user.role_name = roleData?.role_name;
      }

      // Check if user's role is in allowed roles
      if (!req.user.role_name || !allowedRoles.includes(req.user.role_name)) {
        res.status(403).json({ 
          success: false, 
          message: 'Forbidden: Insufficient permissions',
          required_roles: allowedRoles,
          user_role: req.user.role_name
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(403).json({ success: false, message: 'Forbidden' });
    }
  };
};


