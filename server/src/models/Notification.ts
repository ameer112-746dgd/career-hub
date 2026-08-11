import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['APPLICATION_STATUS', 'NEW_JOB', 'MESSAGE', 'INTERVIEW_REMINDER'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);