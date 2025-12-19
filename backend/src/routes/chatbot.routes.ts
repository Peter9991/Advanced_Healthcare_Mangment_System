import { Router } from 'express';
import { handleChatbotMessage } from '../controllers/chatbot.controller';
import { authenticatePatient } from '../middleware/patientAuth.middleware';

const router = Router();

// Chatbot routes (require patient authentication)
router.post('/message', authenticatePatient, handleChatbotMessage);

export default router;

