// TypeScript types for Patient entity
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

