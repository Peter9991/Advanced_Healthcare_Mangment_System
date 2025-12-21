import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse } from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests (patient or staff)
api.interceptors.request.use(
  (config) => {
    // Determine which token to use based on the endpoint
    const url = config.url || '';
    
    // Patient endpoints
    const isPatientEndpoint = url.includes('/patient-auth') || 
                              (url.includes('/patient/') && !url.includes('/patients')) ||
                              url.includes('/chatbot');
    
    // Staff endpoints (exclude patient-auth)
    const isStaffEndpoint = (url.includes('/auth/me') || 
                            (url.includes('/auth/') && !url.includes('/patient-auth'))) ||
                            url.includes('/patients') ||
                            url.includes('/doctors') ||
                            url.includes('/appointments') ||
                            url.includes('/prescriptions') ||
                            url.includes('/billing') ||
                            url.includes('/medical-records') ||
                            url.includes('/lab-results') ||
                            url.includes('/facilities') ||
                            url.includes('/database-admin');
    
    let token: string | null = null;
    
    if (isPatientEndpoint) {
      // Use patient token for patient endpoints
      token = localStorage.getItem('patient_token');
    } else if (isStaffEndpoint) {
      // Use staff token for staff endpoints
      token = localStorage.getItem('token');
    } else {
      // For other endpoints, try staff token first, then patient token
      token = localStorage.getItem('token') || localStorage.getItem('patient_token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token (for login endpoints)
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      // Only redirect if not already on login page or patient login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/patient/login' && !currentPath.startsWith('/patient/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('patient_token');
        // Don't redirect if we're already on login page
        if (!currentPath.includes('login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

