import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { prescriptionService } from '@/services/prescription.service';
import type { Prescription } from '@/services/prescription.service';
import '@/pages/staff/patients/PatientsPage.css';

const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role_name;
  // Only Admin and Doctor can create prescriptions
  const canCreate = role === 'Admin' || role === 'Doctor';
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await prescriptionService.getAll({ page: 1, limit: 50 });
        setPrescriptions(response.data);
      } catch (err: any) {
        console.error('Failed to fetch prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Prescriptions</h1>
        {canCreate && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/prescriptions/new')}>+ New Prescription</button>
          </div>
        )}
      </div>

      {prescriptions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💊</div>
          <h3 className="empty-state-title">No prescriptions found</h3>
          <p className="empty-state-text">
            Prescription management will be available once the backend API is implemented.
            <br />
            This module will allow doctors to create and manage patient prescriptions.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Refills</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.prescription_id}>
                  <td>{new Date(prescription.prescription_date).toLocaleDateString()}</td>
                  <td>{prescription.patient_name || '—'}</td>
                  <td>{prescription.doctor_name || '—'}</td>
                  <td>
                    <span className="status-badge status-active">{prescription.status}</span>
                  </td>
                  <td>{prescription.refills_remaining ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;

