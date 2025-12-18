import { Request, Response } from 'express';
import pool from '../config/database';
import { validateId } from '../utils/validation';

interface RoomWithDetails {
  room_id: number;
  room_number: string;
  room_type: string;
  capacity: number;
  department_id?: number;
  department_name?: string;
  status: string;
  beds_count?: number;
  occupied_beds?: number;
}

// Get all rooms
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const roomType = req.query.room_type as string;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (roomType) {
      conditions.push('r.room_type = ?');
      params.push(roomType);
    }

    if (status) {
      conditions.push('r.status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM rooms r ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    const limitInt = parseInt(String(limit), 10);
    const offsetInt = parseInt(String(offset), 10);

    const [rows] = await pool.execute(
      `SELECT 
        r.room_id,
        r.room_number,
        r.room_type,
        r.capacity,
        r.department_id,
        r.status,
        d.department_name,
        (SELECT COUNT(*) FROM beds b WHERE b.room_id = r.room_id) as beds_count,
        (SELECT COUNT(*) FROM beds b 
         INNER JOIN bed_assignments ba ON b.bed_id = ba.bed_id 
         WHERE b.room_id = r.room_id AND ba.status = 'Active') as occupied_beds
       FROM rooms r
       LEFT JOIN departments d ON r.department_id = d.department_id
       ${whereClause}
       ORDER BY r.room_number
       LIMIT ${limitInt} OFFSET ${offsetInt}`,
      params
    );
    const rooms = rows as RoomWithDetails[];

    res.json({
      success: true,
      data: {
        data: rooms,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rooms' });
  }
};

// Get room by ID
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const roomId = validateId(id);

    if (!roomId) {
      res.status(400).json({ success: false, message: 'Invalid room ID' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT 
        r.*,
        d.department_name,
        (SELECT COUNT(*) FROM beds b WHERE b.room_id = r.room_id) as beds_count,
        (SELECT COUNT(*) FROM beds b 
         INNER JOIN bed_assignments ba ON b.bed_id = ba.bed_id 
         WHERE b.room_id = r.room_id AND ba.status = 'Active') as occupied_beds
       FROM rooms r
       LEFT JOIN departments d ON r.department_id = d.department_id
       WHERE r.room_id = ?`,
      [roomId]
    );
    const rooms = rows as any[];

    if (rooms.length === 0) {
      res.status(404).json({ success: false, message: 'Room not found' });
      return;
    }

    res.json({ success: true, data: rooms[0] });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch room' });
  }
};

