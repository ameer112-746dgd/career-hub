import { Response, NextFunction } from 'express';
import Resume from '../models/Resume';
import { analyzeResumeContent } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @desc    Create a new resume
 * @route   POST /api/v1/resumes
 */
export const createResume = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      studentId: req.user?._id,
    });
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all resumes for the logged-in student
 * @route   GET /api/v1/resumes
 */
export const getStudentResumes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resumes = await Resume.find({ studentId: req.user?._id });
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Trigger AI Analysis for a specific resume
 * @route   POST /api/v1/resumes/:id/analyze
 */
export const runAIAnalysis = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Call the AI Service (Logic defined in ai.service.ts)
    const analysis = await analyzeResumeContent(resume.content);

    // Save the analysis results to the database
    resume.aiAnalysis = {
      score: analysis.score,
      feedback: analysis.feedback,
      missingKeywords: analysis.missingKeywords
    };
    
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume.aiAnalysis
    });
  } catch (error) {
    next(error);
  }
};