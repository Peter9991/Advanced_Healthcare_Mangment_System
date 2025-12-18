import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointment.service';
import { patientService } from '@/services/patient.service';
import type { Patient } from '@/types';
import '@/pages/staff/patients/PatientsPage.css';

const MyPatientsPage = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.doctor_id) {
        setError('Doctor ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get all appointments for this doctor
        const appointmentsRes = await appointmentService.getAll({ 
          page: 1, 
          limit: 1000,
          doctor_id: user.doctor_id 
        });
        
        // Extract unique patient IDs from appointments
        const patientIds = new Set<number>();
        appointmentsRes.data.forEach((apt: any) => {
          if (apt.patient_id) {
            patientIds.add(apt.patient_id);
          }
        });
        
        // Fetch actual patient data for each unique patient ID
        const patientPromises = Array.from(patientIds).map(id => 
          patientService.getById(id).catch(() => null)
        );
        
        const patientResults = await Promise.all(patientPromises);
        const validPatients = patientResults.filter((p): p is Patient => p !== null);
        
        setPatients(validPatients);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user?.doctor_id]);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div style={{ padding: '2rem', color: 'red', background: '#fee', borderRadius: '8px' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>My Patients</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
          Patients who have appointments with you
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">No patients found</h3>
          <p className="empty-state-text">You don't have any patients yet. Patients will appear here once they book appointments with you.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>National ID</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.patient_id}>
                  <td>
                    <strong>{patient.first_name} {patient.last_name}</strong>
                  </td>
                  <td>{patient.national_id}</td>
                  <td>{patient.email || '—'}</td>
                  <td>{patient.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPatientsPage;

