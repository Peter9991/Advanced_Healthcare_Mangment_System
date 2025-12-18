import { Router } from 'express';
import { getAllMedicalRecords, getMedicalRecordById } from '../controllers/medicalRecord.controller';
import { validateQuery, validateParams } from '../middleware/validation.middleware';
import { getPatientsQuerySchema } from '../validators/patient.validator';
import { z } from 'zod';

const router = Router();

const medicalRecordIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Medical record ID must be a number')
});

router.get('/', validateQuery(getPatientsQuerySchema), getAllMedicalRecords);
router.get('/:id', validateParams(medicalRecordIdSchema), getMedicalRecordById);

export default router;

