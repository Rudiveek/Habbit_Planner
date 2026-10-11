import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import goalRoutes from './routes/goalRoutes.js';

const app = express();

// Middleware: CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from all origins (Vercel, localhost, custom domains) with credentials
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middleware: Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: HTTP Logging in Development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check & Root API Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Habit Planner API is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
