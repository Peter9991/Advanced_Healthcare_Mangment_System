import api from './api';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface Prescription {
  prescription_id: number;
  patient_id: number;
  patient_name?: string;
  doctor_id: number;
  doctor_name?: string;
  prescription_date: string;
  status: string;
  refills_remaining?: number;
}

export interface PrescriptionCreateRequest {
  patient_id: number;
  doctor_id: number;
  prescription_date: string;
  status?: 'Active' | 'Filled' | 'Cancelled' | 'Expired';
  instructions?: string;
  refills_allowed?: number;
  refills_remaining?: number;
  expiry_date?: string;
}

export const prescriptionService = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Prescription>> => {
    const response = await api.get<ApiResponse<{ data: Prescription[], pagination: PaginatedResponse<Prescription>['pagination'] }>>('/prescriptions', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch prescriptions');
  },

  create: async (data: PrescriptionCreateRequest): Promise<{ prescription_id: number }> => {
    const response = await api.post<ApiResponse<{ prescription_id: number }>>('/prescriptions', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create prescription');
  },
};

