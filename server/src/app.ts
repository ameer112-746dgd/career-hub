import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config();

// 2. Import Routes
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import jobRoutes from './routes/job.routes';
import studentRoutes from './routes/student.routes';
import chatRoutes from './routes/chat.routes';
import interviewRoutes from './routes/interview.routes';
import applicationRoutes from './routes/application.routes';

// 3. Initialize the Express Application
const app: Application = express();

// 4. IMPROVED CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

// USE THIS ONLY IF THE ABOVE FAILS
app.use(cors({
  origin: true, // This tells the server to reflect the origin of the request (Allows everything)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
}));

// 5. Security & Request Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows assets to be loaded from the backend
}));
app.use(morgan('dev')); // Logs requests to the terminal
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parses cookies for JWT tokens

// 6. API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/applications', applicationRoutes); 

// 7. Health Check (To verify server is up at /health)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'CareerHub API is operational',
    timestamp: new Date().toISOString()
  });
});

// 8. Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  
  // Detailed server-side logging
  console.error(`[ERROR] ${req.method} ${req.url} >> ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;