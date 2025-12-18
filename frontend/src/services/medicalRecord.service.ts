import api from './api';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export interface MedicalRecord {
  record_id: number;
  patient_id: number;
  patient_name?: string;
  doctor_id: number;
  doctor_name?: string;
  record_date: string;
  record_time: string;
  chief_complaint?: string;
  assessment?: string;
}

export const medicalRecordService = {
  getAll: async (params?: PaginationParams & { patient_id?: number; doctor_id?: number }): Promise<PaginatedResponse<MedicalRecord>> => {
    const response = await api.get<ApiResponse<{ data: MedicalRecord[], pagination: PaginatedResponse<MedicalRecord>['pagination'] }>>('/medical-records', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch medical records');
  },

  getById: async (id: number): Promise<MedicalRecord> => {
    const response = await api.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch medical record');
  },
};

