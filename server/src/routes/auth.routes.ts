import { Router } from 'express';
import { 
  register, login, logout, getMe, 
  updateDetails, updatePassword, deleteAccount 
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Standard Auth
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// Account Management (No Avatar Route here)
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.delete('/deleteaccount', protect, deleteAccount);

export default router;