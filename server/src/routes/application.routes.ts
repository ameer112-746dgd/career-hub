import { Router } from 'express';
import { applyToJob } from '../controllers/application.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only logged-in students can apply for jobs
router.post('/apply', protect, authorize('student'), applyToJob);

export default router;