import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAuthService } from '@/services/patientAuth.service';
import { appointmentService } from '@/services/appointment.service';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import './PatientDashboardPage.css';

const PatientDashboardPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await patientAuthService.getCurrentPatient();
        setPatient(patientData);
        
        // Fetch upcoming appointments count
        if (patientData?.patient_id) {
          try {
            const appointmentsRes = await appointmentService.getAll({
              page: 1,
              limit: 100,
              patient_id: patientData.patient_id
            });
            
            // Debug logging
            console.log('Appointments response:', appointmentsRes);
            console.log('Appointments data:', appointmentsRes.data);
            
            if (appointmentsRes && appointmentsRes.data && Array.isArray(appointmentsRes.data)) {
              const appointments = appointmentsRes.data;
              console.log('Total appointments fetched:', appointments.length);
              
              // Count upcoming appointments (status Scheduled or Confirmed, date >= today)
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const upcomingCount = appointments.filter((apt: any) => {
                if (!apt.appointment_date) {
                  console.log('Appointment missing date:', apt);
                  return false;
                }
                
                try {
                  const aptDate = new Date(apt.appointment_date);
                  aptDate.setHours(0, 0, 0, 0);
                  
                  // Check status - handle both status_name and status fields
                  const status = apt.status_name || apt.status || '';
                  const statusLower = status.toLowerCase();
                  
                  // Include appointments that are Scheduled or Confirmed and not completed/cancelled
                  const isUpcomingStatus = statusLower === 'scheduled' || 
                                           statusLower === 'confirmed' ||
                                           statusLower === 'in progress';
                  
                  // Check if date is today or in the future
                  const isUpcomingDate = aptDate >= today;
                  
                  const isUpcoming = isUpcomingStatus && isUpcomingDate;
                  
                  if (isUpcoming) {
                    console.log('Upcoming appointment found:', {
                      id: apt.appointment_id,
                      date: apt.appointment_date,
                      status: status,
                      isUpcomingDate,
                      isUpcomingStatus
                    });
                  }
                  
                  return isUpcoming;
                } catch (error) {
                  console.error('Error processing appointment:', apt, error);
                  return false;
                }
              }).length;
              
              console.log('Upcoming appointments count:', upcomingCount);
              setAppointmentsCount(upcomingCount);
            } else {
              console.warn('Invalid appointments response structure:', appointmentsRes);
              setAppointmentsCount(0);
            }
          } catch (err) {
            console.error('Failed to fetch appointments:', err);
            setAppointmentsCount(0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch patient:', error);
        navigate('/patient/login');
      } finally {
        setLoading(false);
      }
    };

    if (patientAuthService.isAuthenticated()) {
      fetchData();
    } else {
      navigate('/patient/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    patientAuthService.logout();
    navigate('/patient/login');
  };

  if (loading) {
    return (
      <div className="patient-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <header className="patient-header">
        <div className="header-content">
          <h1 className="dashboard-title">{language === 'ar' ? 'لوحة تحكم المريض' : 'Patient Dashboard'}</h1>
          <div className="header-actions">
            <LanguageToggle />
            <button onClick={handleLogout} className="btn-logout">
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="patient-main">
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-avatar">
              {patient?.first_name?.[0]}{patient?.last_name?.[0]}
            </div>
            <div className="welcome-info">
              <h2>
                {language === 'ar' 
                  ? `مرحباً، ${patient?.first_name} ${patient?.middle_name || ''} ${patient?.last_name}`.trim()
                  : `Welcome, ${patient?.first_name} ${patient?.middle_name || ''} ${patient?.last_name}`.trim()}
              </h2>
              <p className="patient-id">
                {language === 'ar' ? 'رقم الهوية:' : 'National ID:'} {patient?.national_id}
              </p>
              {patient?.email && (
                <p className="patient-email" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                  {patient.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/patient/book-appointment')} style={{ cursor: 'pointer' }}>
            <div className="card-icon">➕</div>
            <h3>{language === 'ar' ? 'حجز موعد جديد' : 'Book Appointment'}</h3>
            <p className="card-label">{language === 'ar' ? 'انقر للبدء' : 'Click to start'}</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/patient/appointments')} style={{ cursor: 'pointer' }}>
            <div className="card-icon">📅</div>
            <h3>{language === 'ar' ? 'المواعيد القادمة' : 'Upcoming Appointments'}</h3>
            <p className="card-value">{appointmentsCount}</p>
            <p className="card-label">{language === 'ar' ? 'موعد' : 'Appointments'}</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💊</div>
            <h3>{language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions'}</h3>
            <p className="card-value">0</p>
            <p className="card-label">{language === 'ar' ? 'وصفة نشطة' : 'Active Prescriptions'}</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🧪</div>
            <h3>{language === 'ar' ? 'نتائج المختبر' : 'Lab Results'}</h3>
            <p className="card-value">0</p>
            <p className="card-label">{language === 'ar' ? 'نتيجة متاحة' : 'Results Available'}</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>{language === 'ar' ? 'الفواتير' : 'Billing'}</h3>
            <p className="card-value">0</p>
            <p className="card-label">{language === 'ar' ? 'فواتير معلقة' : 'Pending Invoices'}</p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>{language === 'ar' ? 'معلوماتي الشخصية' : 'My Information'}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}</span>
                <span className="info-value">{patient?.first_name} {patient?.middle_name} {patient?.last_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                <span className="info-value">{patient?.email || '—'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                <span className="info-value">{patient?.phone || '—'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'تاريخ الميلاد:' : 'Date of Birth:'}</span>
                <span className="info-value">{patient?.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '—'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'الجنس:' : 'Gender:'}</span>
                <span className="info-value">
                  {patient?.gender === 'M' ? (language === 'ar' ? 'ذكر' : 'Male') : 
                   patient?.gender === 'F' ? (language === 'ar' ? 'أنثى' : 'Female') : 
                   patient?.gender || '—'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'فصيلة الدم:' : 'Blood Type:'}</span>
                <span className="info-value">{patient?.blood_type || '—'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'العنوان:' : 'Address:'}</span>
                <span className="info-value">{patient?.address || '—'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{language === 'ar' ? 'الرمز البريدي:' : 'Postal Code:'}</span>
                <span className="info-value">{patient?.postal_code || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboardPage;

