// import { Response, NextFunction } from 'express';
// import mongoose from 'mongoose';

// import { AuthRequest } from '../middleware/auth.middleware';

// import Application from '../models/Application';
// import Job from '../models/Job';
// import Resume from '../models/Resume';

// /* -------------------------------------------------------------------------- */
// /*                              STUDENT ROUTES                                */
// /* -------------------------------------------------------------------------- */

// /**
//  * @desc    Apply for a Job
//  * @route   POST /api/v1/applications/apply
//  * @access  Private
//  */
// export const applyToJob = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { jobId } = req.body;

//     const studentId = req.user?._id;
//     const studentName = `${req.user?.firstName} ${req.user?.lastName}`;

//     /* ---------------------------------------------------------------------- */
//     /*                         Handle External Jobs                           */
//     /* ---------------------------------------------------------------------- */

//     if (!mongoose.Types.ObjectId.isValid(jobId)) {
//       return res.status(201).json({
//         success: true,
//         message: 'External application registered successfully!',
//       });
//     }

//     /* ---------------------------------------------------------------------- */
//     /*                     Prevent Duplicate Applications                      */
//     /* ---------------------------------------------------------------------- */

//     const existingApplication = await Application.findOne({
//       jobId,
//       studentId,
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         success: false,
//         message: 'You have already submitted an application for this position.',
//       });
//     }

//     /* ---------------------------------------------------------------------- */
//     /*                        Ensure Resume Exists                             */
//     /* ---------------------------------------------------------------------- */

//     const resume = await Resume.findOne({
//       studentId,
//     }).sort({
//       createdAt: -1,
//     });

//     if (!resume) {
//       return res.status(400).json({
//         success: false,
//         message:
//           'Professional Resume required. Please complete your profile first.',
//       });
//     }

//     /* ---------------------------------------------------------------------- */
//     /*                          Check Job Exists                               */
//     /* ---------------------------------------------------------------------- */

//     const job = await Job.findById(jobId).populate('recruiterId');

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: 'This job posting is no longer active.',
//       });
//     }

//     /* ---------------------------------------------------------------------- */
//     /*                         Create Application                              */
//     /* ---------------------------------------------------------------------- */

//     const application = await Application.create({
//       jobId,
//       studentId,
//       resumeId: resume._id,
//       status: 'pending',
//     });

//     /* ---------------------------------------------------------------------- */
//     /*                     Increment Applicant Count                           */
//     /* ---------------------------------------------------------------------- */

//     await Job.findByIdAndUpdate(jobId, {
//       $inc: {
//         applicantsCount: 1,
//       },
//     });

//     /* ---------------------------------------------------------------------- */
//     /*                      Generate Recruiter WhatsApp Link                   */
//     /* ---------------------------------------------------------------------- */

//     const recruiter: any = job.recruiterId;
//     let whatsappLink = '';

//     if (recruiter?.whatsappNumber) {
//       const cleanPhone = recruiter.whatsappNumber.replace(/\D/g, '');

//       const message =
//         `Hello ${recruiter.firstName}!\n\n` +
//         `My name is *${studentName}*. ` +
//         `I have just applied for the *${job.title}* role at *${job.company}* via CareerHub AI.\n\n` +
//         `Please review my AI-scored resume on the dashboard!`;

//       whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
//         message
//       )}`;
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Applied successfully!',
//       whatsappLink,
//       data: application,
//     });
//   } catch (error: any) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Duplicate application detected.',
//       });
//     }

//     console.error('❌ Application Error:', error.message);

//     next(error);
//   }
// };

// /**
//  * @desc    Get Current Student Applications
//  * @route   GET /api/v1/applications/my-applications
//  * @access  Private
//  */
// export const getMyApplications = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const studentId = req.user?._id;

//     const applications = await Application.find({
//       studentId,
//     })
//       .populate('jobId')
//       .sort({
//         createdAt: -1,
//       });

//     res.status(200).json({
//       success: true,
//       data: applications,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware';
import Application from '../models/Application';
import Job from '../models/Job';
import Resume from '../models/Resume';
import Message from '../models/Message'; // Import Message model

export const applyToJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user?._id;
    const studentName = `${req.user?.firstName} ${req.user?.lastName}`;

    // 1. GUARD: Resume Check
    const resume = await Resume.findOne({ studentId }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(400).json({ 
        success: false, 
        message: "Action Required: Please build your AI Resume before applying." 
      });
    }

    // 2. GUARD: Duplicate Check
    const existing = await Application.findOne({ jobId, studentId });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already submitted an application for this role." 
      });
    }

    // 3. FETCH JOB & RECRUITER
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job no longer exists." });

    // 4. CREATE APPLICATION
    const application = await Application.create({
      jobId,
      studentId,
      resumeId: resume._id,
      status: 'pending'
    });

    // 5. INTERNAL NOTIFICATION: Automated Message to Recruiter
    // This connects them instantly in the Chat section
    await Message.create({
      sender: studentId,
      recipient: job.recruiterId,
      content: `Hi! I'm ${studentName}. I've just applied for the "${job.title}" position. My AI-scored resume is attached to my profile. I'd love to discuss this opportunity further!`
    });

    // 6. ANALYTICS
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    res.status(201).json({ 
      success: true, 
      message: "Application submitted! You can now follow up in the Messages section.",
      data: application 
    });

  } catch (error: any) {
    next(error);
  }
};