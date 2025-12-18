import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { doctorService } from '@/services/doctor.service';
import type { DoctorWithDetails } from '@/types';
import '@/pages/staff/patients/PatientsPage.css';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role_name === 'Admin';
  const [doctors, setDoctors] = useState<DoctorWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setSearch(searchInput);
    }, 300); // 300ms delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getAll({ page: 1, limit: 50, search });
        setDoctors(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [search]);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading doctors...</div>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Doctors</h1>
        {isAdmin && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/doctors/new')}>+ New Doctor</button>
          </div>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors by name, license, or specialty..."
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {doctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍⚕️</div>
          <h3 className="empty-state-title">No doctors found</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>License</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.doctor_id}>
                  <td>
                    <strong>Dr. {doctor.first_name} {doctor.last_name}</strong>
                  </td>
                  <td>{doctor.specialty_name || '—'}</td>
                  <td>{doctor.department_name || '—'}</td>
                  <td>{doctor.license_number}</td>
                  <td>{doctor.email || '—'}</td>
                  <td>
                    <span className={`status-badge ${doctor.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {doctor.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;

