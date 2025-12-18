import api from './api';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface Invoice {
  invoice_id: number;
  invoice_number: string;
  patient_id: number;
  patient_name?: string;
  invoice_date: string;
  total_amount: number;
  status: string;
}

export const billingService = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get<ApiResponse<{ data: Invoice[], pagination: PaginatedResponse<Invoice>['pagination'] }>>('/billing', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch invoices');
  },
};

