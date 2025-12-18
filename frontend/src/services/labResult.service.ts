import api from './api';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export interface LabResult {
  result_id: number;
  order_item_id: number;
  test_id: number;
  test_name?: string;
  patient_id?: number;
  patient_name?: string;
  result_value?: string;
  unit?: string;
  reference_range?: string;
  status?: string;
  result_date: string;
  result_time: string;
}

export interface LabOrderCreateRequest {
  patient_id: number;
  doctor_id: number;
  order_date: string;
  order_time: string;
  priority?: 'Routine' | 'Urgent' | 'STAT' | 'ASAP';
  test_ids: number[];
}

export const labResultService = {
  getAll: async (params?: PaginationParams & { patient_id?: number }): Promise<PaginatedResponse<LabResult>> => {
    const response = await api.get<ApiResponse<{ data: LabResult[], pagination: PaginatedResponse<LabResult>['pagination'] }>>('/lab-results', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lab results');
  },

  getById: async (id: number): Promise<LabResult> => {
    const response = await api.get<ApiResponse<LabResult>>(`/lab-results/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lab result');
  },

  createOrder: async (data: LabOrderCreateRequest): Promise<{ order_id: number }> => {
    const response = await api.post<ApiResponse<{ order_id: number }>>('/lab-results/orders', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create lab order');
  },
};

