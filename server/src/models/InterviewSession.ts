import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewSession extends Document {
  studentId: mongoose.Types.ObjectId;
  jobTitle: string;
  questions: Array<{
    question: string;
    answer?: string;
    feedback?: string;
    score?: number;
  }>;
  overallScore: number;
  status: 'started' | 'completed';
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true },
    questions: [{
      question: String,
      answer: String,
      feedback: String,
      score: Number
    }],
    overallScore: { type: Number, default: 0 },
    status: { type: String, enum: ['started', 'completed'], default: 'started' }
  },
  { timestamps: true }
);

export default mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);