import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointment.service';
import type { AppointmentWithDetails } from '@/types';
import '../patients/PatientsPage.css';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role_name === 'Admin';
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getAll({ page: 1, limit: 50 });
        setAppointments(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading appointments...</div>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Appointments</h1>
        {isAdmin && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/appointments/new')}>+ New Appointment</button>
          </div>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3 className="empty-state-title">No appointments found</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointment_id}>
                  <td>
                    <div>
                      <strong>{new Date(appointment.appointment_date).toLocaleDateString()}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {appointment.appointment_time}
                      </div>
                    </div>
                  </td>
                  <td>{appointment.patient_name || '—'}</td>
                  <td>{appointment.doctor_name || '—'}</td>
                  <td>{appointment.appointment_type || '—'}</td>
                  <td>
                    <span className="status-badge status-active">
                      {appointment.status_name || 'Scheduled'}
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

export default AppointmentsPage;

