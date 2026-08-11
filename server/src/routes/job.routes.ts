// import { Router } from 'express';
// import { 
//   getJobs, getJobById, postJob, 
//   deleteJob, getRecruiterJobs, 
//   getRecruiterAnalytics, getRecruiterActivity, toggleJobStatus,
//   getRecommendedJobs
// } from '../controllers/job.controller';
// import { protect, authorize } from '../middleware/auth.middleware';

// const router = Router();

// // --- PUBLIC ---
// router.get('/', getJobs);
// router.get('/recommended', getRecommendedJobs);
// router.get('/:id', getJobById);

// // --- PROTECTED RECRUITER ---
// router.use(protect);
// router.use(authorize('recruiter'));

// router.get('/recruiter/analytics', getRecruiterAnalytics);
// router.get('/recruiter/activity', getRecruiterActivity);
// router.get('/recruiter/my-jobs', getRecruiterJobs);
// router.put('/recruiter/status/:id', toggleJobStatus);

// router.post('/', postJob);
// router.delete('/:id', deleteJob);

// export default router;

import { Router } from 'express';
import { 
  getJobs, 
  getJobById, 
  postJob, 
  updateJob, // Ensure this is imported
  deleteJob, 
  getRecruiterJobs, 
  getRecruiterAnalytics, 
  getRecruiterActivity, 
  toggleJobStatus,
  getRecommendedJobs
} from '../controllers/job.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// --- 1. PUBLIC ROUTES ---
// Always put specific strings (like /recommended) BEFORE dynamic parameters (like /:id)
router.get('/', getJobs);
router.get('/recommended', getRecommendedJobs);
router.get('/:id', getJobById); 

// --- 2. PROTECTED RECRUITER ROUTES ---
router.use(protect);
router.use(authorize('recruiter'));

// Analytics & Feed
router.get('/recruiter/analytics', getRecruiterAnalytics);
router.get('/recruiter/activity', getRecruiterActivity);
router.get('/recruiter/my-jobs', getRecruiterJobs);

// Job Management
router.post('/', postJob);                               // POST /api/v1/jobs (Create)
router.put('/:id', updateJob);                          // PUT /api/v1/jobs/:id (Update - Missing in your previous code)
router.patch('/recruiter/status/:id', toggleJobStatus); // PATCH for status changes
router.delete('/:id', deleteJob);                       // DELETE /api/v1/jobs/:id

export default router;