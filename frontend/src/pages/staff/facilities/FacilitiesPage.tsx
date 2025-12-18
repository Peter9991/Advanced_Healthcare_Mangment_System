import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { facilityService } from '@/services/facility.service';
import type { Room } from '@/services/facility.service';
import '@/pages/staff/patients/PatientsPage.css';

const FacilitiesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role_name === 'Admin';
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await facilityService.getAllRooms({ page: 1, limit: 50 });
        setRooms(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading facilities...</div>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Facilities & Rooms</h1>
        {isAdmin && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/facilities/new')}>+ Add Room</button>
          </div>
        )}
      </div>

      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏥</div>
          <h3 className="empty-state-title">No rooms found</h3>
          <p className="empty-state-text">Start by adding a new room</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Department</th>
                <th>Capacity</th>
                <th>Beds</th>
                <th>Occupied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.room_id}>
                  <td><strong>{room.room_number}</strong></td>
                  <td>{room.room_type}</td>
                  <td>{room.department_name || '—'}</td>
                  <td>{room.capacity}</td>
                  <td>{room.beds_count || 0}</td>
                  <td>{room.occupied_beds || 0}</td>
                  <td>
                    <span className={`status-badge status-${room.status?.toLowerCase() || 'available'}`}>
                      {room.status}
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

export default FacilitiesPage;
