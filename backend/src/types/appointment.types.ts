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

