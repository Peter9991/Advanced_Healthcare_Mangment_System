import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointment.service';
import '@/pages/staff/patients/PatientsPage.css';

interface EarningsData {
  totalEarnings: number;
  completedAppointments: number;
  pendingAppointments: number;
  monthlyEarnings: { month: string; amount: number }[];
}

const MyEarningsPage = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    monthlyEarnings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user?.doctor_id) {
        setError('Doctor ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const appointmentsRes = await appointmentService.getAll({ 
          page: 1, 
          limit: 1000,
          doctor_id: user.doctor_id 
        });
        
        const appointments = appointmentsRes.data;
        
        // Calculate earnings from completed appointments
        const completedAppointments = appointments.filter((apt: any) => {
          const status = (apt.status_name || apt.status || '').toLowerCase();
          return status === 'completed' && apt.appointment_fee;
        });
        
        const totalEarnings = completedAppointments.reduce((sum: number, apt: any) => {
          return sum + Number(apt.appointment_fee || 0);
        }, 0);
        
        const pendingAppointments = appointments.filter((apt: any) => {
          const status = (apt.status_name || apt.status || '').toLowerCase();
          return status === 'scheduled' || status === 'confirmed';
        });
        
        // Calculate monthly earnings
        const monthlyMap = new Map<string, number>();
        completedAppointments.forEach((apt: any) => {
          const date = new Date(apt.appointment_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const current = monthlyMap.get(monthKey) || 0;
          monthlyMap.set(monthKey, current + Number(apt.appointment_fee || 0));
        });
        
        const monthlyEarnings = Array.from(monthlyMap.entries())
          .map(([key, amount]) => {
            const [year, month] = key.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return {
              month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              amount
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateB.getTime() - dateA.getTime();
          });
        
        setEarnings({
          totalEarnings,
          completedAppointments: completedAppointments.length,
          pendingAppointments: pendingAppointments.length,
          monthlyEarnings
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user?.doctor_id]);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading earnings...</div>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>My Earnings</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
          Revenue from completed appointments
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>
            {Number(earnings.totalEarnings || 0).toFixed(2)} EGP
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Earnings</div>
        </div>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>
            {earnings.completedAppointments}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Completed Appointments</div>
        </div>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
            {earnings.pendingAppointments}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pending Appointments</div>
        </div>
      </div>

      {earnings.monthlyEarnings.length > 0 && (
        <div style={{ marginTop: '2rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Monthly Earnings</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {earnings.monthlyEarnings.map((item, index) => (
                  <tr key={index}>
                    <td><strong>{item.month}</strong></td>
                    <td style={{ fontSize: '1.125rem', fontWeight: 600, color: '#10b981' }}>
                      {item.amount.toFixed(2)} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEarningsPage;

