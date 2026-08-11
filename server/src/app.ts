import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// 1. Load environment variables before anything else
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

// 4. Comprehensive Security & Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet()); // Sets various HTTP headers for security
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL encoded data
app.use(cookieParser()); // Parsing cookies for JWT Refresh Tokens

// 5. API Endpoints
// We group these logically under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/applications', applicationRoutes); 

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'CareerHub API is operational' });
});

// 6. Global Error Handler
// This catches all errors passed to next(err)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  
  // Log error for the developer in the terminal
  console.error(`[ERROR] ${req.method} ${req.url} >> ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;