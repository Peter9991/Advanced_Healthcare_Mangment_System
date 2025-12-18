import { Router } from 'express';
import { getAllRooms, getRoomById } from '../controllers/facility.controller';
import { validateQuery, validateParams } from '../middleware/validation.middleware';
import { getPatientsQuerySchema } from '../validators/patient.validator';
import { z } from 'zod';

const router = Router();

const roomIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Room ID must be a number')
});

router.get('/rooms', validateQuery(getPatientsQuerySchema), getAllRooms);
router.get('/rooms/:id', validateParams(roomIdSchema), getRoomById);

export default router;

