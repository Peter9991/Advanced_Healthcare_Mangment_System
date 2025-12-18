import { Router } from 'express';
import { getAllLabResults, getLabResultById, createLabOrder } from '../controllers/labResult.controller';
import { validateQuery, validateParams, validateBody } from '../middleware/validation.middleware';
import { getPatientsQuerySchema } from '../validators/patient.validator';
import { z } from 'zod';

const router = Router();

const labResultIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Lab result ID must be a number')
});

const createLabOrderSchema = z.object({
  patient_id: z.number().int().positive('Patient ID must be a positive number'),
  doctor_id: z.number().int().positive('Doctor ID must be a positive number'),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  order_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:MM:SS format'),
  priority: z.enum(['Routine', 'Urgent', 'STAT', 'ASAP']).optional(),
  test_ids: z.array(z.number().int().positive()).min(1, 'At least one test must be selected')
});

router.get('/', validateQuery(getPatientsQuerySchema), getAllLabResults);
router.get('/:id', validateParams(labResultIdSchema), getLabResultById);
router.post('/orders', validateBody(createLabOrderSchema), createLabOrder);

export default router;

