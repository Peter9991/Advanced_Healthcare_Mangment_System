import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import appointmentRoutes from './routes/appointment.routes';
import authRoutes from './routes/auth.routes';
import patientAuthRoutes from './routes/patientAuth.routes';
import prescriptionRoutes from './routes/prescription.routes';
import billingRoutes from './routes/billing.routes';
import medicalRecordRoutes from './routes/medicalRecord.routes';
import labResultRoutes from './routes/labResult.routes';
import facilityRoutes from './routes/facility.routes';
import chatbotRoutes from './routes/chatbot.routes';
import databaseAdminRoutes from './routes/databaseAdmin.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: true, // Allow all origins (for development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
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
app.use('/api/patient-auth', patientAuthRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/lab-results', labResultRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/database-admin', databaseAdminRoutes);

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
      console.log(`   💊 Prescriptions: http://localhost:${PORT}/api/prescriptions`);
      console.log(`   💰 Billing: http://localhost:${PORT}/api/billing`);
      console.log(`   📋 Medical Records: http://localhost:${PORT}/api/medical-records`);
      console.log(`   🧪 Lab Results: http://localhost:${PORT}/api/lab-results`);
      console.log(`   🏥 Facilities: http://localhost:${PORT}/api/facilities`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

