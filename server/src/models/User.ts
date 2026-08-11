import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'recruiter'], default: 'student' },
    profileViews: { type: Number, default: 0 }, 
    whatsappNumber: { type: String, default: '' }, 
    bio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    
    // Arrays for Students
    experience: [{
      company: String,
      role: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      year: String
    }]
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (pass: string) {
  return await bcrypt.compare(pass, this.password);
};

export default mongoose.model('User', UserSchema);