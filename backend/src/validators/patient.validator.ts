import { z } from 'zod';

// Patient creation schema
export const createPatientSchema = z.object({
  national_id: z.string().min(1, 'National ID is required'),
  passport_number: z.string().optional().nullable(),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  middle_name: z.string().max(100).optional().nullable(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  gender: z.enum(['M', 'F', 'Other'], {
    message: 'Gender must be M, F, or Other'
  }),
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional().nullable(),
  occupation: z.string().max(100).optional().nullable()
});

// Patient update schema (all fields optional except validation)
export const updatePatientSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  middle_name: z.string().max(100).optional().nullable(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  gender: z.enum(['M', 'F', 'Other']).optional(),
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional().nullable(),
  occupation: z.string().max(100).optional().nullable(),
  status: z.enum(['Active', 'Inactive', 'Deceased']).optional()
});

// Query parameters schema for patients list
export const getPatientsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Deceased', 'All']).optional()
});

// Patient ID parameter schema
export const patientIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Patient ID must be a number')
});


