// import { Router } from 'express';
// import { 
//   getConversations, 
//   getChatHistory, 
//   searchRecruiters 
// } from '../controllers/chat.controller';
// import { protect } from '../middleware/auth.middleware';

// // 1. INITIALIZE the router FIRST
// const router = Router();

// // 2. DEFINE the routes AFTER initialization
// // All chat routes should be protected
// router.use(protect);

// /**
//  * @route   GET /api/v1/chat/partners
//  * @desc    Get list of people the user has chatted with
//  */
// router.get('/partners', getConversations);

// /**
//  * @route   GET /api/v1/chat/search
//  * @desc    Search for recruiters to start a new chat
//  */
// router.get('/search', searchRecruiters);

// /**
//  * @route   GET /api/v1/chat/history/:partnerId
//  * @desc    Get message history between two users
//  */
// router.get('/history/:partnerId', getChatHistory);

// // 3. EXPORT the router
// export default router;

import { Router } from 'express';
import { 
  getDiscoverableUsers, 
  getChatHistory, 
  sendMessage, 
  updateMessage, 
  deleteMessage, 
  getPublicProfile 
} from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Apply protection to all chat-related endpoints
router.use(protect);

/**
 * @route   GET /api/v1/chat/discover
 */
router.get('/discover', getDiscoverableUsers);

/**
 * @route   GET /api/v1/chat/history/:partnerId
 */
router.get('/history/:partnerId', getChatHistory);

/**
 * @route   POST /api/v1/chat/send
 */
router.post('/send', sendMessage);

/**
 * @route   PUT /api/v1/chat/message/:id
 */
router.put('/message/:id', updateMessage);

/**
 * @route   DELETE /api/v1/chat/message/:id
 */
router.delete('/message/:id', deleteMessage);

/**
 * @route   GET /api/v1/chat/public-profile/:id
 */
router.get('/public-profile/:id', getPublicProfile);

export default router;