import { Router } from 'express';
import { getAllInvoices } from '../controllers/billing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { getPatientsQuerySchema } from '../validators/patient.validator';

const router = Router();

router.get('/', authenticate, validateQuery(getPatientsQuerySchema), getAllInvoices);

export default router;

