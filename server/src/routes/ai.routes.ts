import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { generateCoverLetter } from '../services/ai.service';
import Resume from '../models/Resume';

const router = Router();

router.post('/cover-letter', protect, async (req: any, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const resume = await Resume.findById(resumeId);
    
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const letter = await generateCoverLetter(resume.content, jobDescription);
    res.json({ success: true, data: letter });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;