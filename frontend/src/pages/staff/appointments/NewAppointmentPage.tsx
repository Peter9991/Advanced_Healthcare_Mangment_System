import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService, AppointmentCreateRequest } from '@/services/appointment.service';
import { patientService } from '@/services/patient.service';
import { doctorService } from '@/services/doctor.service';
import '@/pages/staff/patients/PatientsPage.css';

const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState<AppointmentCreateRequest>({
    patient_id: 0,
    doctor_id: 0,
    appointment_date: '',
    appointment_time: '',
    appointment_type_id: 1, // Default: Consultation
    status_id: 1, // Default: Scheduled
    reason_for_visit: '',
    notes: ''
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          patientService.getAll({ page: 1, limit: 100 }),
          doctorService.getAll({ page: 1, limit: 100 })
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error('Failed to fetch options:', err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'patient_id' || name === 'doctor_id' || name === 'appointment_type_id' || name === 'status_id' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.patient_id || !formData.doctor_id) {
      setError('Please select both patient and doctor');
      return;
    }

    setLoading(true);

    try {
      const result = await appointmentService.create(formData);
      alert(`Appointment created successfully! ID: ${result.appointment_id}`);
      navigate('/dashboard/appointments');
    } catch (err: any) {
      setError(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    { id: 1, name: 'Consultation' },
    { id: 2, name: 'Follow-up' },
    { id: 3, name: 'Emergency' },
    { id: 4, name: 'Surgery Consultation' },
    { id: 5, name: 'Routine Check' }
  ];

  const appointmentStatuses = [
    { id: 1, name: 'Scheduled' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'In Progress' },
    { id: 4, name: 'Completed' },
    { id: 5, name: 'Cancelled' },
    { id: 6, name: 'No Show' }
  ];

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>New Appointment</h1>
        <button onClick={() => navigate('/dashboard/appointments')} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', color: 'red', background: '#fee', borderRadius: '8px', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Patient <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="0">Select Patient...</option>
              {patients.map(patient => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.first_name} {patient.last_name} ({patient.national_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Doctor <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="0">Select Doctor...</option>
              {doctors.map(doctor => (
                <option key={doctor.doctor_id} value={doctor.doctor_id}>
                  Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty_name || 'General'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Date <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Time <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value + ':00' }))}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Appointment Type <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="appointment_type_id"
              value={formData.appointment_type_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {appointmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Status <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="status_id"
              value={formData.status_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {appointmentStatuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Reason for Visit</label>
          <textarea
            name="reason_for_visit"
            value={formData.reason_for_visit || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, reason_for_visit: e.target.value }))}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/appointments')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAppointmentPage;
