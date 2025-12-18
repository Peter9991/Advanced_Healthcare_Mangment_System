import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { labResultService } from '@/services/labResult.service';
import type { LabResult } from '@/services/labResult.service';
import '@/pages/staff/patients/PatientsPage.css';

const LabResultsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role_name;
  // Only Admin, Doctor, Lab Technician can create lab orders
  const canCreate = role === 'Admin' || role === 'Doctor' || role === 'Lab Technician';
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await labResultService.getAll({ page: 1, limit: 50 });
        setResults(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lab results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading lab results...</div>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Lab Results</h1>
        {canCreate && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/lab-results/new')}>+ New Lab Order</button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧪</div>
          <h3 className="empty-state-title">No lab results found</h3>
          <p className="empty-state-text">Start by creating a new lab order</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Result ID</th>
                <th>Test Name</th>
                <th>Patient</th>
                <th>Result Value</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.result_id}>
                  <td>{result.result_id}</td>
                  <td><strong>{result.test_name || `Test #${result.test_id}`}</strong></td>
                  <td>{result.patient_name || `Patient #${result.patient_id}`}</td>
                  <td>{result.result_value || '—'}</td>
                  <td>{result.unit || '—'}</td>
                  <td>
                    <span className={`status-badge status-${result.status?.toLowerCase() || 'pending'}`}>
                      {result.status || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(result.result_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LabResultsPage;
