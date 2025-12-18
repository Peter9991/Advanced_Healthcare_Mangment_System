import { useState, useEffect } from 'react';
import { medicalRecordService } from '@/services/medicalRecord.service';
import type { MedicalRecord } from '@/services/medicalRecord.service';
import '@/pages/staff/patients/PatientsPage.css';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await medicalRecordService.getAll({ page: 1, limit: 50 });
        setRecords(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch medical records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading medical records...</div>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Medical Records</h1>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No medical records found</h3>
          <p className="empty-state-text">Medical records are created automatically during patient visits and appointments</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Chief Complaint</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.record_id}>
                  <td>{record.record_id}</td>
                  <td>{record.patient_name || `Patient #${record.patient_id}`}</td>
                  <td>Dr. {record.doctor_name || `Doctor #${record.doctor_id}`}</td>
                  <td>{new Date(record.record_date).toLocaleDateString()}</td>
                  <td>{record.chief_complaint || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
