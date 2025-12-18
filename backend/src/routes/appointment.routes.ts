import { Router } from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment
} from '../controllers/appointment.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { 
  createAppointmentSchema, 
  getAppointmentsQuerySchema, 
  appointmentIdSchema 
} from '../validators/appointment.validator';

const router = Router();

router.get('/', validateQuery(getAppointmentsQuerySchema), getAllAppointments);
router.get('/:id', validateParams(appointmentIdSchema), getAppointmentById);
router.post('/', validateBody(createAppointmentSchema), createAppointment);

export default router;

