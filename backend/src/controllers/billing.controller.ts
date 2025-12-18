import { Request, Response } from 'express';
import pool from '../config/database';

interface InvoiceWithDetails {
  invoice_id: number;
  invoice_number: string;
  patient_id: number;
  patient_name?: string;
  invoice_date: string;
  total_amount: number;
  status: string;
}

// Get all invoices
export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM invoices'
    );
    const total = (countResult as any[])[0].total;

    // Get invoices with patient names
    const [rows] = await pool.execute(
      `SELECT 
        i.invoice_id,
        i.invoice_number,
        i.patient_id,
        i.invoice_date,
        i.total_amount,
        i.status,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name
       FROM invoices i
       INNER JOIN patients p ON i.patient_id = p.patient_id
       ORDER BY i.invoice_date DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`
    );
    const invoices = rows as InvoiceWithDetails[];

    res.json({
      success: true,
      data: {
        data: invoices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

