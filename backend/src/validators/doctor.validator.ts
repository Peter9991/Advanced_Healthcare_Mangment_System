import { z } from 'zod';

// Query parameters schema for doctors list
export const getDoctorsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  status: z.enum(['Active', 'On Leave', 'Inactive', 'All']).optional()
});

// Doctor ID parameter schema
export const doctorIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Doctor ID must be a number')
});


