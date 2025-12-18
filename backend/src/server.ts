import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import appointmentRoutes from './routes/appointment.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Healthcare Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection route
app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    await testConnection();
    res.json({ status: 'OK', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection on startup
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔌 Database test: http://localhost:${PORT}/api/test-db`);
      console.log(`\n📡 API Endpoints:`);
      console.log(`   🔐 Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   👥 Patients: http://localhost:${PORT}/api/patients`);
      console.log(`   👨‍⚕️ Doctors: http://localhost:${PORT}/api/doctors`);
      console.log(`   📅 Appointments: http://localhost:${PORT}/api/appointments`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

