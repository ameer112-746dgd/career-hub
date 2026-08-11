import 'dotenv/config'; // <--- THIS MUST BE LINE 1. DO NOT MOVE IT.

import app from './app';
import { connectDB } from './database/connection';
import { createServer } from 'http';
import { setupSocket } from './socket';

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
setupSocket(httpServer);

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();