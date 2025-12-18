import { Request, Response } from 'express';
import pool from '../config/database';
import { validateId } from '../utils/validation';

interface LabResultWithDetails {
  result_id: number;
  order_item_id: number;
  test_id: number;
  test_name?: string;
  patient_id?: number;
  patient_name?: string;
  result_value?: string;
  unit?: string;
  reference_range?: string;
  status?: string;
  result_date: string;
  result_time: string;
}

// Get all lab results
export const getAllLabResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const patientId = req.query.patient_id ? validateId(req.query.patient_id as string) : null;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (patientId) {
      conditions.push('lto.patient_id = ?');
      params.push(patientId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM lab_results lr
       INNER JOIN lab_test_order_items ltoi ON lr.order_item_id = ltoi.order_item_id
       INNER JOIN lab_test_orders lto ON ltoi.order_id = lto.order_id
       ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);

    const [rows] = await pool.execute(
      `SELECT 
        lr.result_id,
        lr.order_item_id,
        lr.test_id,
        lr.result_value,
        lr.unit,
        lr.reference_range,
        lr.status,
        lr.result_date,
        lr.result_time,
        lt.test_name,
        lto.patient_id,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name
       FROM lab_results lr
       INNER JOIN lab_test_order_items ltoi ON lr.order_item_id = ltoi.order_item_id
       INNER JOIN lab_test_orders lto ON ltoi.order_id = lto.order_id
       INNER JOIN lab_tests lt ON lr.test_id = lt.test_id
       INNER JOIN patients p ON lto.patient_id = p.patient_id
       ${whereClause}
       ORDER BY lr.result_date DESC, lr.result_time DESC
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      params
    );
    const results = rows as LabResultWithDetails[];

    res.json({
      success: true,
      data: {
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lab results' });
  }
};

// Get lab result by ID
export const getLabResultById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resultId = validateId(id);

    if (!resultId) {
      res.status(400).json({ success: false, message: 'Invalid result ID' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT 
        lr.*,
        lt.test_name,
        lto.patient_id,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name
       FROM lab_results lr
       INNER JOIN lab_test_order_items ltoi ON lr.order_item_id = ltoi.order_item_id
       INNER JOIN lab_test_orders lto ON ltoi.order_id = lto.order_id
       INNER JOIN lab_tests lt ON lr.test_id = lt.test_id
       INNER JOIN patients p ON lto.patient_id = p.patient_id
       WHERE lr.result_id = ?`,
      [resultId]
    );
    const results = rows as any[];

    if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Lab result not found' });
      return;
    }

    res.json({ success: true, data: results[0] });
  } catch (error) {
    console.error('Error fetching lab result:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lab result' });
  }
};

// Create new lab test order
export const createLabOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient_id, doctor_id, order_date, order_time, priority, test_ids } = req.body;

    // Create lab test order
    const [orderResult] = await pool.execute(
      `INSERT INTO lab_test_orders (
        patient_id, doctor_id, order_date, order_time, priority, status
      ) VALUES (?, ?, ?, ?, ?, 'Ordered')`,
      [
        patient_id,
        doctor_id,
        order_date,
        order_time,
        priority || 'Routine'
      ]
    );

    const orderInsertResult = orderResult as any;
    const orderId = orderInsertResult.insertId;

    // Create lab test order items
    if (test_ids && Array.isArray(test_ids) && test_ids.length > 0) {
      const values = test_ids.map((testId: number) => `(${orderId}, ${testId}, 'Ordered')`).join(', ');
      await pool.execute(
        `INSERT INTO lab_test_order_items (order_id, test_id, status) VALUES ${values}`
      );
    }

    res.status(201).json({
      success: true,
      message: 'Lab order created successfully',
      data: { order_id: orderId }
    });
  } catch (error: any) {
    console.error('Error creating lab order:', error);
    res.status(500).json({ success: false, message: 'Failed to create lab order' });
  }
};
