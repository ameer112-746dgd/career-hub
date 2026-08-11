// import mongoose, { Schema, Document } from 'mongoose';
// import bcrypt from 'bcryptjs';

// const UserSchema = new Schema(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true, select: false },
//     role: { type: String, enum: ['student', 'recruiter'], default: 'student' },
//     profileViews: { type: Number, default: 0 }, 
//     whatsappNumber: { type: String, default: '' }, 
//     bio: { type: String, default: '' },
//     github: { type: String, default: '' },
//     linkedin: { type: String, default: '' },
//     portfolio: { type: String, default: '' },
//     skills: { type: [String], default: [] },
//     instagram: { type: String, default: '' },
//     twitter: { type: String, default: '' },
    
//     // Arrays for Students
//     experience: [{
//       company: String,
//       role: String,
//       duration: String,
//       description: String
//     }],
//     education: [{
//       institution: String,
//       degree: String,
//       year: String
//     }]
//   },
//   { timestamps: true }
// );

// UserSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });

// UserSchema.methods.comparePassword = async function (pass: string) {
//   return await bcrypt.compare(pass, this.password);
// };

// export default mongoose.model('User', UserSchema);

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define an Interface to tell TypeScript what a "User" looks like
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'recruiter';
  profileViews: number;
  whatsappNumber: string;
  bio: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  instagram: string;
  twitter: string;
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>; // This fixes the TS2339 error
}

// 2. Pass the IUser interface to the Schema
const UserSchema = new Schema<IUser>(
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

// 3. Typing the 'this' context in the pre-save hook
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// 4. Implement the method
UserSchema.methods.comparePassword = async function (pass: string): Promise<boolean> {
  return await bcrypt.compare(pass, this.password);
};

// 5. Export the model with the IUser interface
export default mongoose.model<IUser>('User', UserSchema);