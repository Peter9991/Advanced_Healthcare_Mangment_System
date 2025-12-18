// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Patient Types
export interface Patient {
  patient_id?: number;
  national_id: string;
  passport_number?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'Other';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  occupation?: string;
  status?: 'Active' | 'Inactive' | 'Deceased';
  registration_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientCreateRequest {
  national_id: string;
  passport_number?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'Other';
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  occupation?: string;
}

export interface PatientUpdateRequest {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  occupation?: string;
  status?: 'Active' | 'Inactive' | 'Deceased';
}

// Doctor Types
export interface Doctor {
  doctor_id?: number;
  staff_id?: number;
  license_number: string;
  specialization_id?: number;
  years_of_experience?: number;
  consultation_fee?: number;
  bio?: string;
  status?: 'Active' | 'On Leave' | 'Inactive';
}

export interface DoctorWithDetails extends Doctor {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  specialty_name?: string;
  department_name?: string;
}

// Appointment Types
export interface Appointment {
  appointment_id?: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type_id: number;
  status_id: number;
  reason_for_visit?: string;
  notes?: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient_name?: string;
  doctor_name?: string;
  appointment_type?: string;
  status_name?: string;
  specialty_name?: string;
}

export interface AppointmentCreateRequest {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  appointment_type_id: number;
  status_id: number;
  reason_for_visit?: string;
  notes?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    staff_id: number;
    employee_id: string;
    email: string;
    role_id: number;
  };
}

export interface User {
  doctor_id?: number | null;
  staff_id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: number;
  role_name: string;
  department_id?: number;
  department_name?: string;
  status: string;
}

