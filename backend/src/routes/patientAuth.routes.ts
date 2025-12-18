import { Router } from 'express';
import { patientLogin, getCurrentPatient } from '../controllers/patientAuth.controller';
import { authenticatePatient } from '../middleware/patientAuth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const patientLoginSchema = z.object({
  national_id: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(1, 'Password is required')
}).refine(data => data.national_id || data.email, {
  message: 'Either national_id or email is required'
});

router.post('/login', validateBody(patientLoginSchema), patientLogin);
router.get('/me', authenticatePatient, getCurrentPatient);

export default router;

