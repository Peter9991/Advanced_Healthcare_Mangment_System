import api from './api';
import type { ApiResponse } from '../types';

export interface ChatbotResponse {
  message: string;
  action?: {
    type: 'book_appointment';
    data: {
      doctor_id: number;
      doctor_name: string;
      appointment_date: string;
      appointment_time: string;
      reason?: string;
    };
  };
}

export const chatbotService = {
  sendMessage: async (message: string): Promise<ChatbotResponse> => {
    const response = await api.post<ApiResponse<ChatbotResponse>>('/chatbot/message', {
      message
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Failed to get chatbot response');
  },
};

