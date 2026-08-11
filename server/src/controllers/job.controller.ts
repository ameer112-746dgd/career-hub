// import { Response, NextFunction, Request } from 'express';
// import mongoose from 'mongoose';
// import Job from '../models/Job';
// import Application from '../models/Application';
// import { AuthRequest } from '../middleware/auth.middleware';

// /**
//  * @desc    Get all jobs (Student Search View)
//  */
// export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { keyword, type } = req.query;
//     let dbQuery: any = { status: 'open' };

//     if (keyword) {
//       dbQuery.$or = [
//         { title: { $regex: keyword, $options: 'i' } },
//         { company: { $regex: keyword, $options: 'i' } }
//       ];
//     }

//     if (type) {
//       dbQuery.type = { $in: (type as string).split(',') };
//     }

//     const jobs = await Job.find(dbQuery).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: jobs });
//   } catch (error) { next(error); }
// };

// /**
//  * @desc    Get single job details
//  */
// export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid Job ID" });
//     }

//     const job = await Job.findById(id).populate('recruiterId', 'firstName lastName bio github linkedin instagram twitter whatsappNumber email');
//     if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

//     res.status(200).json({ success: true, data: job });
//   } catch (error) { next(error); }
// };

// /**
//  * @desc    Get Detailed Recruiter Analytics & Trend Data
//  */
// export const getRecruiterAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const recruiterId = req.user?._id;
//     const myJobs = await Job.find({ recruiterId });
//     const jobIds = myJobs.map(j => j._id);

//     // 1. Trend Logic: Count applications per day for the last 7 days
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const trends = await Application.aggregate([
//       { $match: { jobId: { $in: jobIds }, createdAt: { $gte: sevenDaysAgo } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { "_id": 1 } }
//     ]);

//     const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds } });

//     res.status(200).json({
//       success: true,
//       data: {
//         activeJobs: myJobs.filter(j => j.status === 'open').length,
//         totalApplicants,
//         trends: trends.map(t => ({ name: t._id, apps: t.count }))
//       }
//     });
//   } catch (error) { next(error); }
// };

// /**
//  * @desc    Get Real Activity Feed for Recruiter
//  */
// export const getRecruiterActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const recruiterId = req.user?._id;
//     const myJobs = await Job.find({ recruiterId });
//     const jobIds = myJobs.map(j => j._id);

//     // Fetch real recent applications
//     const recentApps = await Application.find({ jobId: { $in: jobIds } })
//       .populate('studentId', 'firstName lastName')
//       .populate('jobId', 'title')
//       .sort({ createdAt: -1 })
//       .limit(6);

//     const activity = recentApps.map(app => ({
//       user: `${(app.studentId as any)?.firstName} ${(app.studentId as any)?.lastName}`,
//       action: 'applied for',
//       target: (app.jobId as any)?.title || 'Deleted Position',
//       time: app.createdAt
//     }));

//     res.status(200).json({ success: true, data: activity });
//   } catch (error) { next(error); }
// };

// /**
//  * @desc    Standard CRUD & Status Management
//  */
// export const postJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const job = await Job.create({ ...req.body, recruiterId: req.user?._id });
//     res.status(201).json({ success: true, data: job });
//   } catch (error) { next(error); }
// };

// export const toggleJobStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const job = await Job.findOneAndUpdate(
//       { _id: req.params.id, recruiterId: req.user?._id },
//       { status: req.body.status },
//       { new: true }
//     );
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     res.status(200).json({ success: true, data: job });
//   } catch (error) { next(error); }
// };

// export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user?._id });
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     res.status(200).json({ success: true, message: "Deleted" });
//   } catch (error) { next(error); }
// };

// export const getRecruiterJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const jobs = await Job.find({ recruiterId: req.user?._id }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: jobs });
//   } catch (error) { next(error); }
// };

// export const getRecommendedJobs = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 }).limit(3);
//     res.status(200).json({ success: true, data: jobs });
//   } catch (error) { next(error); }
// };

import { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job';
import Application from '../models/Application';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @desc    Get all jobs (Student Search View)
 */
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword, type } = req.query;
    let dbQuery: any = { status: 'open' };

    if (keyword) {
      dbQuery.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (type) {
      dbQuery.type = { $in: (type as string).split(',') };
    }

    const jobs = await Job.find(dbQuery).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) { next(error); }
};

/**
 * @desc    Get single job details
 */
export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID format" });
    }

    const job = await Job.findById(id).populate('recruiterId', 'firstName lastName email bio');
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) { next(error); }
};

/**
 * @desc    Create new job
 */
export const postJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.create({ 
      ...req.body, 
      recruiterId: req.user?._id,
      status: 'open' // Ensure new jobs default to open
    });
    res.status(201).json({ success: true, data: job });
  } catch (error) { next(error); }
};

/**
 * @desc    Update existing job (Required by your PostJob frontend)
 */
export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
    
    res.status(200).json({ success: true, data: job });
  } catch (error) { next(error); }
};

/**
 * @desc    Recruiter Analytics
 */
export const getRecruiterAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const recruiterId = req.user?._id;
    const myJobs = await Job.find({ recruiterId });
    const jobIds = myJobs.map(j => j._id);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await Application.aggregate([
      { $match: { jobId: { $in: jobIds }, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds } });

    res.status(200).json({
      success: true,
      data: {
        activeJobs: myJobs.filter(j => j.status === 'open').length,
        totalApplicants,
        trends: trends.map(t => ({ name: t._id, apps: t.count }))
      }
    });
  } catch (error) { next(error); }
};

/**
 * @desc    Get Real Activity Feed
 */
export const getRecruiterActivity = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const recruiterId = req.user?._id;
    const myJobs = await Job.find({ recruiterId });
    const jobIds = myJobs.map(j => j._id);

    const recentApps = await Application.find({ jobId: { $in: jobIds } })
      .populate('studentId', 'firstName lastName')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .limit(6);

    const activity = recentApps.map(app => ({
      user: `${(app.studentId as any)?.firstName} ${(app.studentId as any)?.lastName}`,
      action: 'applied for',
      target: (app.jobId as any)?.title || 'Deleted Position',
      time: app.createdAt
    }));

    res.status(200).json({ success: true, data: activity });
  } catch (error) { next(error); }
};

export const toggleJobStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user?._id },
      { status: req.body.status },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) { next(error); }
};

export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user?._id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) { next(error); }
};

export const getRecruiterJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user?._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) { next(error); }
};

export const getRecommendedJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 }).limit(3);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) { next(error); }
};