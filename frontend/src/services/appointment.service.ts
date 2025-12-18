import api from './api';
import type {
  ApiResponse,
  Appointment,
  AppointmentWithDetails,
  AppointmentCreateRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export type { AppointmentCreateRequest };

export const appointmentService = {
  // Get all appointments with pagination and filters
  getAll: async (params?: PaginationParams & { doctor_id?: number; patient_id?: number; date?: string }): Promise<PaginatedResponse<AppointmentWithDetails>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<AppointmentWithDetails>>>('/appointments', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch appointments');
  },

  // Get appointment by ID
  getById: async (id: number): Promise<AppointmentWithDetails> => {
    const response = await api.get<ApiResponse<AppointmentWithDetails>>(`/appointments/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch appointment');
  },

  // Create new appointment
  create: async (data: AppointmentCreateRequest): Promise<{ appointment_id: number }> => {
    const response = await api.post<ApiResponse<{ appointment_id: number }>>('/appointments', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create appointment');
  },
};

