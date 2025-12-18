import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilityService } from '@/services/facility.service';
import '@/pages/staff/patients/PatientsPage.css';

const NewFacilityPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    room_number: '',
    department_id: '',
    room_type: 'Ward',
    capacity: '1',
    floor_number: '',
    status: 'Available'
  });

  const roomTypes = [
    'Ward',
    'Private',
    'ICU',
    'Operation Theater',
    'Emergency',
    'Consultation',
    'Isolation',
    'Other'
  ];

  const statusOptions = [
    'Available',
    'Occupied',
    'Maintenance',
    'Reserved',
    'Out of Service'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement room creation API call
      // This requires a createRoom method in facilityService
      const roomData = {
        room_number: formData.room_number,
        department_id: formData.department_id ? parseInt(formData.department_id) : undefined,
        room_type: formData.room_type,
        capacity: parseInt(formData.capacity),
        floor_number: formData.floor_number ? parseInt(formData.floor_number) : undefined,
        status: formData.status
      };

      // Placeholder for API call
      alert('Room creation functionality will be implemented once the backend API is ready.');
      console.log('Room data:', roomData);
      // await facilityService.createRoom(roomData);
      // navigate('/dashboard/facilities');
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Add New Room</h1>
        <button onClick={() => navigate('/dashboard/facilities')} className="btn btn-secondary">
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
              Room Number <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
              placeholder="e.g., 101, A-205"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Department ID <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              placeholder="Enter department ID"
              min="1"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>Enter the department ID this room belongs to</small>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Room Type <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Status <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Capacity <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="Number of beds/occupants"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Floor Number
            </label>
            <input
              type="number"
              name="floor_number"
              value={formData.floor_number}
              onChange={handleChange}
              min="0"
              placeholder="Floor number (optional)"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/facilities')}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewFacilityPage;

