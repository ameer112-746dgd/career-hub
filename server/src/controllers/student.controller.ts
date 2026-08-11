import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Resume from '../models/Resume';
import Application from '../models/Application';
import User from '../models/User';

export const getStudentAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?._id;

    const [resume, appsCount, userRecord] = await Promise.all([
      Resume.findOne({ studentId }).sort({ createdAt: -1 }),
      Application.countDocuments({ studentId }),
      User.findById(studentId).select('profileViews') // <--- Fetch the real count
    ]);

    res.status(200).json({
      success: true,
      data: {
        resumeScore: resume?.aiAnalysis?.score || 0,
        applicationsSent: appsCount || 0,
        interviewsScheduled: 0,
        profileViews: userRecord?.profileViews || 0 // <--- Return the real count
      }
    });
  } catch (error) { next(error); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};