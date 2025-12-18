import api from './api';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export interface Room {
  room_id: number;
  room_number: string;
  room_type: string;
  capacity: number;
  department_id?: number;
  department_name?: string;
  status: string;
  beds_count?: number;
  occupied_beds?: number;
}

export const facilityService = {
  getAllRooms: async (params?: PaginationParams & { room_type?: string; status?: string }): Promise<PaginatedResponse<Room>> => {
    const response = await api.get<ApiResponse<{ data: Room[], pagination: PaginatedResponse<Room>['pagination'] }>>('/facilities/rooms', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch rooms');
  },

  getRoomById: async (id: number): Promise<Room> => {
    const response = await api.get<ApiResponse<Room>>(`/facilities/rooms/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch room');
  },
};

