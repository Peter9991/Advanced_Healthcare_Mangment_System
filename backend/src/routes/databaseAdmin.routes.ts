import { Router } from 'express';
import { executeQuery } from '../controllers/databaseAdmin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only Database Administrator role can access
router.post(
  '/execute',
  authenticate,
  authorize('Database Administrator'),
  executeQuery
);

export default router;

