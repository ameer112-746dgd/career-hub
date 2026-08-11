import { Server } from 'socket.io';
import Message from '../models/Message';

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    /* -------------------------------------------------------------------------- */
    /*                                 JOIN ROOM                                  */
    /* -------------------------------------------------------------------------- */

    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`👤 User joined room: ${userId}`);
    });

    /* -------------------------------------------------------------------------- */
    /*                               SEND MESSAGE                                 */
    /* -------------------------------------------------------------------------- */

    socket.on('send_message', async (data) => {
      const { senderId, recipientId, content } = data;

      try {
        // Save message to database
        const message = await Message.create({
          sender: senderId,
          recipient: recipientId,
          content,
        });

        // Send to recipient
        io.to(recipientId).emit('receive_message', message);

        // Send confirmation back to sender
        io.to(senderId).emit('message_sent', message);
      } catch (error) {
        console.error('❌ Socket Error:', error);
      }
    });

    /* -------------------------------------------------------------------------- */
    /*                              DELETE MESSAGE                                */
    /* -------------------------------------------------------------------------- */

    socket.on('delete_message', (data) => {
      const { recipientId, messageId } = data;

      io.to(recipientId).emit('message_deleted', messageId);
    });

    /* -------------------------------------------------------------------------- */
    /*                               EDIT MESSAGE                                 */
    /* -------------------------------------------------------------------------- */

    socket.on('edit_message', (data) => {
      io.to(data.recipientId).emit('message_edited', data);
    });

    /* -------------------------------------------------------------------------- */
    /*                                DISCONNECT                                  */
    /* -------------------------------------------------------------------------- */

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};