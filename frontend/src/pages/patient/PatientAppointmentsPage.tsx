import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '@/services/appointment.service';
import { patientAuthService } from '@/services/patientAuth.service';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import './PatientAppointmentsPage.css';

const PatientAppointmentsPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientData = await patientAuthService.getCurrentPatient();
        setPatient(patientData);
        
        const appointmentsRes = await appointmentService.getAll({
          page: 1,
          limit: 100,
          patient_id: patientData.patient_id
        });
        setAppointments(appointmentsRes.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { en: string; ar: string; color: string }> = {
      'Scheduled': { en: 'Scheduled', ar: 'مجدول', color: '#3b82f6' },
      'Confirmed': { en: 'Confirmed', ar: 'مؤكد', color: '#10b981' },
      'In Progress': { en: 'In Progress', ar: 'قيد التنفيذ', color: '#f59e0b' },
      'Completed': { en: 'Completed', ar: 'مكتمل', color: '#6b7280' },
      'Cancelled': { en: 'Cancelled', ar: 'ملغي', color: '#ef4444' },
      'No Show': { en: 'No Show', ar: 'لم يحضر', color: '#9ca3af' }
    };
    
    const statusInfo = statusMap[status] || { en: status, ar: status, color: '#6b7280' };
    
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}
      >
        {language === 'ar' ? statusInfo.ar : statusInfo.en}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="patient-appointments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-appointments-page">
      <header className="appointments-header">
        <div className="header-content">
          <h1>{language === 'ar' ? 'مواعيدي' : 'My Appointments'}</h1>
          <div className="header-actions">
            <LanguageToggle />
            <button
              className="btn-primary"
              onClick={() => navigate('/patient/book-appointment')}
            >
              {language === 'ar' ? '+ حجز موعد جديد' : '+ Book New Appointment'}
            </button>
          </div>
        </div>
      </header>

      <main className="appointments-main">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>{language === 'ar' ? 'لا توجد مواعيد' : 'No Appointments'}</h3>
            <p>
              {language === 'ar'
                ? 'لم تقم بحجز أي مواعيد بعد. احجز موعدك الأول الآن!'
                : "You haven't booked any appointments yet. Book your first appointment now!"}
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate('/patient/book-appointment')}
            >
              {language === 'ar' ? 'احجز موعد الآن' : 'Book Appointment Now'}
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.appointment_id} className="appointment-card">
                <div className="appointment-header-card">
                  <div className="appointment-date-time">
                    <div className="date-section">
                      <div className="date-day">
                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                          day: 'numeric'
                        })}
                      </div>
                      <div className="date-month">
                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                          month: 'short'
                        })}
                      </div>
                    </div>
                    <div className="time-section">
                      <div className="time-icon">🕐</div>
                      <div className="time-value">
                        {appointment.appointment_time?.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status_name || appointment.status)}
                </div>
                
                <div className="appointment-body">
                  <div className="appointment-info">
                    <div className="info-row">
                      <span className="info-label">{language === 'ar' ? 'الطبيب:' : 'Doctor:'}</span>
                      <span className="info-value">{appointment.doctor_name || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">{language === 'ar' ? 'نوع الموعد:' : 'Type:'}</span>
                      <span className="info-value">{appointment.appointment_type || '—'}</span>
                    </div>
                    {appointment.reason_for_visit && (
                      <div className="info-row">
                        <span className="info-label">{language === 'ar' ? 'السبب:' : 'Reason:'}</span>
                        <span className="info-value">{appointment.reason_for_visit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientAppointmentsPage;

