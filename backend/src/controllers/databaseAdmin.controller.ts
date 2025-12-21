import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/database';

export const executeQuery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Query is required and must be a string'
      });
      return;
    }

    // Trim and check if query is empty
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      res.status(400).json({
        success: false,
        message: 'Query cannot be empty'
      });
      return;
    }

    // Execute the query
    const [results, fields] = await pool.execute(trimmedQuery);

    // Format response
    res.json({
      success: true,
      data: {
        results: results,
        fields: fields ? (fields as any[]).map((field: any) => ({
          name: field.name,
          type: field.type,
          length: field.length
        })) : [],
        rowCount: Array.isArray(results) ? results.length : 0,
        affectedRows: (results as any).affectedRows || 0
      }
    });
  } catch (error: any) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      message: 'Query execution failed',
      error: error.message || 'Unknown database error'
    });
  }
};

