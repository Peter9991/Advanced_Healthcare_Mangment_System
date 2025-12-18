import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="home-page">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}>
        <LanguageToggle />
      </div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">{t('login.title')}</h1>
            <p className="hero-subtitle">
              {t('login.title') === 'Healthcare Management System' 
                ? 'Comprehensive solution for managing patients, appointments, medical records, and hospital operations'
                : 'حل شامل لإدارة المرضى والمواعيد والسجلات الطبية وعمليات المستشفى'}
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                {t('login.staffLogin')}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/patient/login')}>
                {t('login.patientLogin')}
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/hms_Pic.jpg" alt="Healthcare Management System" className="hero-img" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Patient Management</h3>
              <p>
                Complete patient records management including personal information, 
                medical history, insurance details, and contact information.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Doctor & Staff</h3>
              <p>
                Manage doctor profiles, specialties, schedules, and staff assignments 
                across different departments.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Appointments</h3>
              <p>
                Schedule and manage appointments with automated reminders, 
                availability tracking, and status management.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Medical Records</h3>
              <p>
                Digital medical records with diagnoses, treatments, vital signs, 
                and comprehensive patient history tracking.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Prescriptions</h3>
              <p>
                Electronic prescription management with medication tracking, 
                refills, and pharmacy integration.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧪</div>
              <h3>Lab & Diagnostics</h3>
              <p>
                Laboratory test orders, results management, radiology imaging, 
                and diagnostic report tracking.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Billing & Finance</h3>
              <p>
                Invoice generation, payment processing, insurance claims, 
                and financial reporting.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Facilities</h3>
              <p>
                Room and bed management, admissions, surgical procedures, 
                and operation theater bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Why Choose Our System?</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <h3>🔒 Secure & Compliant</h3>
              <p>Role-based access control, data encryption, and HIPAA-compliant security measures</p>
            </div>
            <div className="benefit-item">
              <h3>⚡ Fast & Efficient</h3>
              <p>Streamlined workflows reduce administrative time and improve patient care</p>
            </div>
            <div className="benefit-item">
              <h3>📊 Comprehensive Reporting</h3>
              <p>Real-time analytics and reports for better decision-making</p>
            </div>
            <div className="benefit-item">
              <h3>🔄 Integrated System</h3>
              <p>All modules work together seamlessly for complete healthcare management</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Access the system with your credentials to begin managing your healthcare operations</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/login')}>
            Login to System
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Healthcare Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

