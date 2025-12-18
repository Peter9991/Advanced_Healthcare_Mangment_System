import api from './api';
import type {
  ApiResponse,
  DoctorWithDetails,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export const doctorService = {
  // Get all doctors with pagination and filters
  getAll: async (params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<DoctorWithDetails>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<DoctorWithDetails>>>('/doctors', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch doctors');
  },

  // Get doctor by ID
  getById: async (id: number): Promise<DoctorWithDetails> => {
    const response = await api.get<ApiResponse<DoctorWithDetails>>(`/doctors/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch doctor');
  },
};

