import { Router } from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patient.controller';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { 
  createPatientSchema, 
  updatePatientSchema, 
  getPatientsQuerySchema, 
  patientIdSchema 
} from '../validators/patient.validator';

const router = Router();

// Patient routes
router.get('/', validateQuery(getPatientsQuerySchema), getAllPatients);
router.get('/:id', validateParams(patientIdSchema), getPatientById);
router.post('/', validateBody(createPatientSchema), createPatient);
router.put('/:id', validateParams(patientIdSchema), validateBody(updatePatientSchema), updatePatient);
router.delete('/:id', validateParams(patientIdSchema), deletePatient);

export default router;

