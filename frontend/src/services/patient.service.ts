import api from './api';
import type {
  ApiResponse,
  Patient,
  PatientCreateRequest,
  PatientUpdateRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export const patientService = {
  // Get all patients with pagination and filters
  getAll: async (params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Patient>>>('/patients', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch patients');
  },

  // Get patient by ID
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch patient');
  },

  // Create new patient
  create: async (data: PatientCreateRequest): Promise<{ patient_id: number }> => {
    const response = await api.post<ApiResponse<{ patient_id: number }>>('/patients', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create patient');
  },

  // Update patient
  update: async (id: number, data: PatientUpdateRequest): Promise<void> => {
    const response = await api.put<ApiResponse<null>>(`/patients/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update patient');
    }
  },

  // Delete patient (soft delete)
  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<null>>(`/patients/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete patient');
    }
  },
};

