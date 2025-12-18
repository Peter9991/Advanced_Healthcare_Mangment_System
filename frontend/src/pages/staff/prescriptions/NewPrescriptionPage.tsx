import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { prescriptionService, PrescriptionCreateRequest } from '@/services/prescription.service';
import { patientService } from '@/services/patient.service';
import { doctorService } from '@/services/doctor.service';
import '@/pages/staff/patients/PatientsPage.css';

const NewPrescriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState<PrescriptionCreateRequest>({
    patient_id: 0,
    doctor_id: 0,
    prescription_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    instructions: '',
    refills_allowed: 0,
    refills_remaining: 0,
    expiry_date: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'patient_id' || name === 'doctor_id' || name === 'refills_allowed' || name === 'refills_remaining'
        ? parseInt(value) || 0
        : value === '' ? undefined : value
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
      const result = await prescriptionService.create(formData);
      alert(`Prescription created successfully! ID: ${result.prescription_id}`);
      navigate('/dashboard/prescriptions');
    } catch (err: any) {
      setError(err.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>New Prescription</h1>
        <button onClick={() => navigate('/dashboard/prescriptions')} className="btn btn-secondary">
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
                  Dr. {doctor.first_name} {doctor.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Prescription Date <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              name="prescription_date"
              value={formData.prescription_date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="Active">Active</option>
              <option value="Filled">Filled</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Refills Allowed</label>
            <input
              type="number"
              name="refills_allowed"
              value={formData.refills_allowed || 0}
              onChange={handleChange}
              min="0"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Refills Remaining</label>
            <input
              type="number"
              name="refills_remaining"
              value={formData.refills_remaining || 0}
              onChange={handleChange}
              min="0"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions || ''}
            onChange={handleChange}
            rows={4}
            placeholder="e.g., Take with food, avoid driving if drowsy..."
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
            {loading ? 'Creating...' : 'Create Prescription'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/prescriptions')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPrescriptionPage;
