import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  headline: string;
  bio: string;
  skills: string[];
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
  }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String, trim: true },
    bio: { type: String },
    skills: [{ type: String }],
    education: [{
      school: String,
      degree: String,
      field: String,
      startYear: String,
      endYear: String
    }],
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: { type: Boolean, default: false },
      description: String
    }],
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);