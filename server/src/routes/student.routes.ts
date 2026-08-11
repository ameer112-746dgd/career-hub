import { Router } from 'express';
import { getStudentAnalytics, updateProfile } from '../controllers/student.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// All student routes require the user to be logged in AND have the 'student' role
router.use(protect);
router.use(authorize('student'));

// This maps to GET /api/v1/student/analytics
router.get('/analytics', getStudentAnalytics);

// This maps to PUT /api/v1/student/profile
router.put('/profile', updateProfile);

export default router;