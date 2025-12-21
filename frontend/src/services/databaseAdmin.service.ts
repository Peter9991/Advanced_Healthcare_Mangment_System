import api from './api';
import type { ApiResponse } from '../types';

export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  results: any[];
  fields: Array<{
    name: string;
    type: number;
    length: number;
  }>;
  rowCount: number;
  affectedRows: number;
}

export const databaseAdminService = {
  executeQuery: async (query: string): Promise<QueryResponse> => {
    const response = await api.post<ApiResponse<QueryResponse>>(
      '/database-admin/execute',
      { query }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Query execution failed');
  },
};

