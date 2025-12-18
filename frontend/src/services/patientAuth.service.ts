import api from './api';
import type { ApiResponse } from '../types';

export interface PatientLoginRequest {
  national_id?: string;
  email?: string;
  password: string;
}

export interface PatientLoginResponse {
  token: string;
  user: {
    patient_id: number;
    national_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    user_type: 'patient';
  };
}

export interface Patient {
  patient_id: number;
  national_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender: string;
  blood_type?: string;
  status: string;
}

export const patientAuthService = {
  // Patient login
  login: async (credentials: PatientLoginRequest): Promise<PatientLoginResponse> => {
    const response = await api.post<ApiResponse<PatientLoginResponse>>('/patient-auth/login', credentials);
    if (response.data.success && response.data.data) {
      // Store token and user info separately for patients
      localStorage.setItem('patient_token', response.data.data.token);
      localStorage.setItem('patient_user', JSON.stringify(response.data.data.user));
      // Clear staff auth if exists
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  // Get current patient
  getCurrentPatient: async (): Promise<Patient> => {
    const response = await api.get<ApiResponse<Patient>>('/patient-auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch patient');
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_user');
  },

  // Check if patient is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('patient_token');
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('patient_token');
  },

  // Get stored patient
  getStoredPatient: (): PatientLoginResponse['user'] | null => {
    const userStr = localStorage.getItem('patient_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
};

