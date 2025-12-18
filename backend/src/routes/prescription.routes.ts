import { Router } from 'express';
import { getAllPrescriptions, createPrescription } from '../controllers/prescription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { getPatientsQuerySchema } from '../validators/patient.validator';
import { z } from 'zod';

const router = Router();

const createPrescriptionSchema = z.object({
  patient_id: z.number().int().positive('Patient ID must be a positive number'),
  doctor_id: z.number().int().positive('Doctor ID must be a positive number'),
  prescription_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['Active', 'Filled', 'Cancelled', 'Expired']).optional(),
  instructions: z.string().max(1000).optional().nullable(),
  refills_allowed: z.number().int().min(0).optional(),
  refills_remaining: z.number().int().min(0).optional(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional().nullable()
});

router.get('/', authenticate, validateQuery(getPatientsQuerySchema), getAllPrescriptions);
router.post('/', authenticate, validateBody(createPrescriptionSchema), createPrescription);

export default router;

