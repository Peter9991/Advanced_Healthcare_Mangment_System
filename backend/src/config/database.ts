import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Ensure required env vars are present
const required = (name: string): string => {
  const val = process.env[name];
  if (!val || val.trim() === '') {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return val;
};

// Database connection configuration
const dbConfig: any = {
  host: required('DB_HOST'),
  port: parseInt(required('DB_PORT')),
  user: required('DB_USER'),
  password: required('DB_PASSWORD'),
  database: required('DB_NAME'),
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: 0,
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '60000')
};

// SSL Configuration for AWS RDS
if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') {
  dbConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' && process.env.DB_SSL_REJECT_UNAUTHORIZED !== '0'
  };
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export default pool;

