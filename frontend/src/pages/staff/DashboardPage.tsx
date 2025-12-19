import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointment.service';
import { patientService } from '@/services/patient.service';
import { doctorService } from '@/services/doctor.service';
import { prescriptionService } from '@/services/prescription.service';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myAppointmentsCount, setMyAppointmentsCount] = useState(0);
  const [myPatientsCount, setMyPatientsCount] = useState(0);
  const [myEarnings, setMyEarnings] = useState(0);
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);
  const [activeDoctorsCount, setActiveDoctorsCount] = useState(0);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const [pendingPrescriptionsCount, setPendingPrescriptionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isDoctor = user?.role_name === 'Doctor';

  useEffect(() => {
    if (isDoctor && user?.doctor_id) {
      const fetchDoctorData = async () => {
        try {
          // Fetch doctor's appointments
          const appointmentsRes = await appointmentService.getAll({
            page: 1,
            limit: 100,
            doctor_id: user.doctor_id
          });
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcomingCount = appointmentsRes.data.filter((apt: any) => {
            const aptDate = new Date(apt.appointment_date);
            aptDate.setHours(0, 0, 0, 0);
            const status = (apt.status_name || apt.status || '').toLowerCase();
            return (status === 'scheduled' || status === 'confirmed') && aptDate >= today;
          }).length;
          setMyAppointmentsCount(upcomingCount);

          // Get unique patients count
          const uniquePatients = new Set(appointmentsRes.data.map((apt: any) => apt.patient_id));
          setMyPatientsCount(uniquePatients.size);

          // Calculate earnings from completed appointments
          const completedAppointments = appointmentsRes.data.filter((apt: any) => {
            const status = (apt.status_name || apt.status || '').toLowerCase();
            return status === 'completed' && apt.appointment_fee;
          });
          const totalEarnings = completedAppointments.reduce((sum: number, apt: any) => {
            return sum + Number(apt.appointment_fee || 0);
          }, 0);
          setMyEarnings(totalEarnings);
        } catch (error) {
          console.error('Failed to fetch doctor data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDoctorData();
    } else if (user?.role_name === 'Admin') {
      // Fetch admin dashboard stats
      const fetchAdminData = async () => {
        try {
          // Fetch total patients count
          const patientsRes = await patientService.getAll({ page: 1, limit: 1, status: 'All' });
          setTotalPatientsCount(patientsRes.pagination.total);

          // Fetch active doctors count
          const doctorsRes = await doctorService.getAll({ page: 1, limit: 1, status: 'Active' });
          setActiveDoctorsCount(doctorsRes.pagination.total);

          // Fetch today's appointments
          const today = new Date().toISOString().split('T')[0];
          const appointmentsRes = await appointmentService.getAll({ page: 1, limit: 1000, date: today });
          setTodayAppointmentsCount(appointmentsRes.pagination.total);

          // Fetch pending prescriptions
          const prescriptionsRes = await prescriptionService.getAll({ page: 1, limit: 1000 });
          const pendingCount = prescriptionsRes.data.filter((p: any) => 
            (p.status || '').toLowerCase() === 'pending' || (p.status || '').toLowerCase() === 'active'
          ).length;
          setPendingPrescriptionsCount(pendingCount);
        } catch (error) {
          console.error('Failed to fetch admin data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [isDoctor, user?.doctor_id, user?.role_name]);

  // Doctor-specific stats
  const doctorStats = [
    { label: 'My Appointments', value: myAppointmentsCount.toString(), icon: '📅', color: '#f59e0b', path: '/dashboard/my-appointments' },
    { label: 'My Patients', value: myPatientsCount.toString(), icon: '👥', color: '#3b82f6', path: '/dashboard/my-patients' },
    { label: 'My Earnings', value: `${Number(myEarnings || 0).toFixed(2)} EGP`, icon: '💰', color: '#10b981', path: '/dashboard/my-earnings' },
    { label: 'Prescriptions', value: '0', icon: '💊', color: '#8b5cf6', path: '/dashboard/prescriptions' },
  ];

  // Admin/Staff stats
  const adminStats = [
    { label: 'Total Patients', value: totalPatientsCount.toString(), icon: '👥', color: '#3b82f6', path: '/dashboard/patients' },
    { label: 'Active Doctors', value: activeDoctorsCount.toString(), icon: '👨‍⚕️', color: '#10b981', path: '/dashboard/doctors' },
    { label: 'Today\'s Appointments', value: todayAppointmentsCount.toString(), icon: '📅', color: '#f59e0b', path: '/dashboard/appointments' },
    { label: 'Pending Prescriptions', value: pendingPrescriptionsCount.toString(), icon: '💊', color: '#8b5cf6', path: '/dashboard/prescriptions' },
  ];

  const stats = isDoctor ? doctorStats : adminStats;

  // Only Admin gets quick actions (add buttons)
  const isAdmin = user?.role_name === 'Admin';
  const adminActions = [
    { label: 'New Patient', icon: '➕', path: '/dashboard/patients/new', color: '#3b82f6' },
    { label: 'New Appointment', icon: '📅', path: '/dashboard/appointments/new', color: '#10b981' },
    { label: 'New Prescription', icon: '💊', path: '/dashboard/prescriptions/new', color: '#f59e0b' },
    { label: 'Lab Order', icon: '🧪', path: '/dashboard/lab-results/new', color: '#8b5cf6' },
  ];

  const quickActions = isAdmin ? adminActions : [];

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {isDoctor && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>👨‍⚕️ Doctor Dashboard</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Welcome, Dr. {user?.first_name} {user?.last_name}</p>
        </div>
      )}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            onClick={() => navigate(stat.path)}
            style={{ borderLeftColor: stat.color, cursor: 'pointer' }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="action-btn"
                onClick={() => navigate(action.path)}
                style={{ borderColor: action.color, color: action.color }}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📋</div>
              <div className="activity-content">
                <p className="activity-title">No recent activity</p>
                <p className="activity-time">Start using the system to see activity here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
