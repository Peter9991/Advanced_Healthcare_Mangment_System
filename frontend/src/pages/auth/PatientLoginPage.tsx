import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { patientAuthService } from '@/services/patientAuth.service';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import './LoginPage.css';

const PatientLoginPage = () => {
  const { t, language } = useLanguage();
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = useEmail 
        ? { email, password }
        : { national_id: nationalId, password };
      
      await patientAuthService.login(credentials);
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <LanguageToggle />
          <h1 className="login-title">{t('patientLogin.title')}</h1>
        </div>
        
        <div className="credentials-box">
          <div className="credentials-header">
            <span className="credentials-icon">🔑</span>
            <strong>{t('login.testCredentials')}</strong>
          </div>
          <p className="credentials-desc">{t('login.testCredentialsDesc')}</p>
          <div className="credentials-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="credential-item">
              <span className="credential-role">{t('patientLogin.testNationalId')}</span>
              <code className="credential-value">1234567890</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('patientLogin.testEmail')}</span>
              <code className="credential-value">ali.almutairi@email.com</code>
            </div>
          </div>
          <p className="credentials-note">{t('login.passwordBypassed')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useEmail}
                onChange={(e) => setUseEmail(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('patientLogin.useEmail')}</span>
            </label>
          </div>

          {!useEmail ? (
            <div className="form-group">
              <label className="form-label">
                {t('patientLogin.nationalId')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                required
                className="form-input"
                placeholder={t('patientLogin.nationalId')}
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">
                {t('login.email')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder={t('login.email')}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {t('login.password')} <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder={t('login.password')}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? t('login.loggingIn') : t('login.submit')}
          </button>
        </form>

        <div className="login-divider">
          <span>{t('login.or')}</span>
        </div>

        <Link to="/login" className="btn btn-secondary btn-full">
          {t('login.loginAsStaff')}
        </Link>
      </div>
    </div>
  );
};

export default PatientLoginPage;
