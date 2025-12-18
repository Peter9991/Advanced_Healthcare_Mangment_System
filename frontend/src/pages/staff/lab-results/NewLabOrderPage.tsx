import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { labResultService, LabOrderCreateRequest } from '@/services/labResult.service';
import { patientService } from '@/services/patient.service';
import { doctorService } from '@/services/doctor.service';
import '@/pages/staff/patients/PatientsPage.css';

const NewLabOrderPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [formData, setFormData] = useState<LabOrderCreateRequest>({
    patient_id: 0,
    doctor_id: 0,
    order_date: new Date().toISOString().split('T')[0],
    order_time: new Date().toTimeString().slice(0, 8),
    priority: 'Routine',
    test_ids: []
  });

  // Common lab tests (you can fetch these from API later)
  const labTests = [
    { id: 1, name: 'Complete Blood Count (CBC)' },
    { id: 2, name: 'Blood Glucose' },
    { id: 3, name: 'Lipid Profile' },
    { id: 4, name: 'Liver Function Test (LFT)' },
    { id: 5, name: 'Kidney Function Test (KFT)' },
    { id: 6, name: 'Thyroid Function Test' },
    { id: 7, name: 'Urine Analysis' },
    { id: 8, name: 'ECG' },
    { id: 9, name: 'X-Ray Chest' },
    { id: 10, name: 'CT Scan' }
  ];

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
      [name]: name === 'patient_id' || name === 'doctor_id'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleTestToggle = (testId: number) => {
    setSelectedTests(prev => {
      const newTests = prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId];
      setFormData(prevForm => ({ ...prevForm, test_ids: newTests }));
      return newTests;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.patient_id || !formData.doctor_id) {
      setError('Please select both patient and doctor');
      return;
    }

    if (selectedTests.length === 0) {
      setError('Please select at least one lab test');
      return;
    }

    setLoading(true);

    try {
      const result = await labResultService.createOrder({
        ...formData,
        test_ids: selectedTests
      });
      alert(`Lab order created successfully! Order ID: ${result.order_id}`);
      navigate('/dashboard/lab-results');
    } catch (err: any) {
      setError(err.message || 'Failed to create lab order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>New Lab Order</h1>
        <button onClick={() => navigate('/dashboard/lab-results')} className="btn btn-secondary">
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
              Order Date <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              name="order_date"
              value={formData.order_date}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Order Time <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="time"
              name="order_time"
              value={formData.order_time}
              onChange={(e) => setFormData(prev => ({ ...prev, order_time: e.target.value + ':00' }))}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="STAT">STAT</option>
            <option value="ASAP">ASAP</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Lab Tests <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            padding: '1rem', 
            maxHeight: '300px', 
            overflowY: 'auto',
            backgroundColor: '#f9f9f9'
          }}>
            {labTests.map(test => (
              <label 
                key={test.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test.id)}
                  onChange={() => handleTestToggle(test.id)}
                  style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}
                />
                <span>{test.name}</span>
              </label>
            ))}
          </div>
          {selectedTests.length > 0 && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
              {selectedTests.length} test(s) selected
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? 'Creating...' : 'Create Lab Order'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/lab-results')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLabOrderPage;
