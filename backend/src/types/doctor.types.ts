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

