import { Router } from 'express';
import { startSession, submitAnswer } from '../controllers/interview.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Secure these routes

router.post('/start', startSession);
router.post('/answer', submitAnswer);

export default router;