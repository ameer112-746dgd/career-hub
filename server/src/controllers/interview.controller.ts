import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import InterviewSession from '../models/InterviewSession';
import { 
  generateInterviewQuestions, 
  evaluateInterviewAnswer, 
  validateJobRole 
} from '../services/ai.service';

export const startSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { jobTitle, jobDescription } = req.body;

    // 1. VALIDATE: If this fails, the code STOPS immediately
    const validation = await validateJobRole(jobTitle);
    
    if (validation.isValid === false) {
      return res.status(400).json({ 
        success: false, 
        message: validation.message || "Invalid Job Title." 
      });
    }

    // 2. PROCEED ONLY IF VALID
    const aiData = await generateInterviewQuestions(jobTitle, jobDescription);
    
    const session = await InterviewSession.create({
      studentId: req.user?._id,
      jobTitle,
      questions: aiData.questions.map((q: string) => ({
        question: q, answer: '', feedback: '', score: 0
      })),
      status: 'started'
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Not found" });

    const evaluation = await evaluateInterviewAnswer(
      session.questions[questionIndex].question, 
      answer, 
      session.jobTitle
    );

    if (evaluation.isRelevant) {
      session.questions[questionIndex].answer = answer;
      session.questions[questionIndex].feedback = evaluation.feedback;
      session.questions[questionIndex].score = evaluation.score;
      if (questionIndex === session.questions.length - 1) session.status = 'completed';
      await session.save();
    }

    res.status(200).json({ success: true, data: evaluation });
  } catch (error) {
    next(error);
  }
};