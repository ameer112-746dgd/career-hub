import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  recruiterId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Remote';
  salaryRange?: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  status: 'open' | 'filled' | 'closed';
  applicantsCount: number;
}

const JobSchema = new Schema<IJob>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Remote'],
      default: 'Full-time',
    },

    salaryRange: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: [
      {
        type: String,
      },
    ],

    skillsRequired: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ['open', 'filled', 'closed'],
      default: 'open',
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search performance
JobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
});

export default mongoose.model<IJob>('Job', JobSchema);