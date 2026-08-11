import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedDate: Date;
}

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], 
      default: 'pending' 
    },
    appliedDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate applications for the same job
ApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);