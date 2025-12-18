import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, getCurrentUser);

export default router;

