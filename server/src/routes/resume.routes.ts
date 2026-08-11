import { Router } from 'express';
import { 
  createResume, 
  getStudentResumes, 
  runAIAnalysis 
} from '../controllers/resume.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Apply protection to all resume routes
router.use(protect);

// Basic CRUD
router.post('/', createResume);
router.get('/', getStudentResumes);

// AI Specific Route - THIS IS LINE 13
router.post('/:id/analyze', runAIAnalysis);

export default router;