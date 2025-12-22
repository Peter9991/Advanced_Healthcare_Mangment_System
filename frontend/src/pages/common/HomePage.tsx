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
              {t('home.heroSubtitle')}
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
          <h2 className="section-title">{t('home.keyFeatures')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>{t('home.feature.patientManagement.title')}</h3>
              <p>{t('home.feature.patientManagement.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>{t('home.feature.doctorStaff.title')}</h3>
              <p>{t('home.feature.doctorStaff.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>{t('home.feature.appointments.title')}</h3>
              <p>{t('home.feature.appointments.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>{t('home.feature.medicalRecords.title')}</h3>
              <p>{t('home.feature.medicalRecords.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>{t('home.feature.prescriptions.title')}</h3>
              <p>{t('home.feature.prescriptions.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧪</div>
              <h3>{t('home.feature.labDiagnostics.title')}</h3>
              <p>{t('home.feature.labDiagnostics.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>{t('home.feature.billingFinance.title')}</h3>
              <p>{t('home.feature.billingFinance.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>{t('home.feature.facilities.title')}</h3>
              <p>{t('home.feature.facilities.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2 className="section-title">{t('home.whyChoose')}</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <h3>{t('home.benefit.secure.title')}</h3>
              <p>{t('home.benefit.secure.desc')}</p>
            </div>
            <div className="benefit-item">
              <h3>{t('home.benefit.fast.title')}</h3>
              <p>{t('home.benefit.fast.desc')}</p>
            </div>
            <div className="benefit-item">
              <h3>{t('home.benefit.reporting.title')}</h3>
              <p>{t('home.benefit.reporting.desc')}</p>
            </div>
            <div className="benefit-item">
              <h3>{t('home.benefit.integrated.title')}</h3>
              <p>{t('home.benefit.integrated.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>{t('home.readyToStart')}</h2>
          <p>{t('home.readyToStartDesc')}</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/login')}>
            {t('home.loginToSystem')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

