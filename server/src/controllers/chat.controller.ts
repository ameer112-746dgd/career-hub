import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Message from '../models/Message';
import User from '../models/User';

/**
 * @desc    Discover Users (Discovery Mode)
 *          Students see all Recruiters; Recruiters see all Students.
 */
export const getDiscoverableUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const targetRole = req.user.role === 'student' ? 'recruiter' : 'student';
    
    const users = await User.find({ role: targetRole })
      .select('firstName lastName role bio github linkedin whatsappNumber')
      .sort({ firstName: 1 });

    res.status(200).json({ success: true, data: users });
  } catch (error) { next(error); }
};

/**
 * @desc    Fetch Chat History between two users
 */
export const getChatHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: partnerId },
        { sender: partnerId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) { next(error); }
};

/**
 * @desc    Send a message (REST endpoint for database persistence)
 */
export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { recipientId, content } = req.body;
    
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) { next(error); }
};

/**
 * @desc    Update a message (Edit)
 */
export const updateMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, sender: req.user._id },
      { content: req.body.content },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ success: true, data: message });
  } catch (error) { next(error); }
};

/**
 * @desc    Delete a message
 */
export const deleteMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOneAndDelete({ _id: req.params.id, sender: req.user._id });
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) { next(error); }
};

export const getPublicProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // 1. Find the user being viewed
    const profile = await User.findById(id).select('-password');
    if (!profile) return res.status(404).json({ message: "User not found" });

    // 2. TRACKING LOGIC: If a Recruiter views a Student, add +1 View
    // We check if the 'viewer' (req.user) is a recruiter and the 'target' (profile) is a student
    if (req.user.role === 'recruiter' && profile.role === 'student') {
      await User.findByIdAndUpdate(id, { $inc: { profileViews: 1 } });
      console.log(`📈 Analytics: Student ${profile.firstName} received a new view from ${req.user.firstName}`);
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};