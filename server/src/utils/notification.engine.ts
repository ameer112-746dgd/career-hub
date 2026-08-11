import Notification from '../models/Notification';

export const createNotification = async (data: {
  recipient: string;
  sender?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) => {
  try {
    const notification = await Notification.create(data);
    
    // In a real production app, we would emit a socket event here
    // io.to(data.recipient).emit('new_notification', notification);
    
    return notification;
  } catch (error) {
    console.error('Notification Error:', error);
  }
};