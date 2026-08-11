import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const recruiters = [
  {
    firstName: 'Jessica',
    lastName: 'Tech talent',
    email: 'jessica@google.com',
    password: 'password123',
    role: 'recruiter',
    isVerified: true
  },
  {
    firstName: 'Marcus',
    lastName: 'Hiring Manager',
    email: 'marcus@meta.com',
    password: 'password123',
    role: 'recruiter',
    isVerified: true
  },
  {
    firstName: 'David',
    lastName: 'Recruitment Lead',
    email: 'david@netflix.com',
    password: 'password123',
    role: 'recruiter',
    isVerified: true
  },
  {
    firstName: 'Emily',
    lastName: 'Staffing Expert',
    email: 'emily@amazon.com',
    password: 'password123',
    role: 'recruiter',
    isVerified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerhub');
    
    console.log('🌱 Seeding recruiters...');
    
    // This will trigger the password hashing hook in the User model
    for (const rec of recruiters) {
      const exists = await User.findOne({ email: rec.email });
      if (!exists) {
        await User.create(rec);
        console.log(`✅ Created: ${rec.firstName}`);
      } else {
        console.log(`⏩ Skipped (exists): ${rec.firstName}`);
      }
    }

    console.log('🚀 Seeding complete! Press Ctrl+C to exit.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();