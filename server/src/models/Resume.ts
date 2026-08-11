import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  content: {
    summary: string;
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      graduationDate: string;
    }>;
    skills: string[];
  };
  aiAnalysis?: {
    score: number;
    feedback: string[];
    missingKeywords: string[];
  };
}

const ResumeSchema = new Schema<IResume>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: {
      summary: { type: String, default: '' },
      experience: [{
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String
      }],
      education: [{
        institution: String,
        degree: String,
        field: String,
        graduationDate: String
      }],
      skills: [String]
    },
    aiAnalysis: {
      score: { type: Number, default: 0 },
      feedback: [String],
      missingKeywords: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);