import { Router } from 'express';
import { getAllDoctors, getDoctorById } from '../controllers/doctor.controller';
import { validateQuery, validateParams } from '../middleware/validation.middleware';
import { getDoctorsQuerySchema, doctorIdSchema } from '../validators/doctor.validator';

const router = Router();

router.get('/', validateQuery(getDoctorsQuerySchema), getAllDoctors);
router.get('/:id', validateParams(doctorIdSchema), getDoctorById);

export default router;

