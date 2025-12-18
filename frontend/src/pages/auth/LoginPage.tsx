import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import type { LoginRequest } from '@/types';
import LanguageToggle from '@/components/LanguageToggle';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials: LoginRequest = { email, password };
      await login(credentials);
      navigate('/dashboard');
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
          <h1 className="login-title">{t('login.title')}</h1>
        </div>

        <div className="credentials-box">
          <div className="credentials-header">
            <span className="credentials-icon">🔑</span>
            <strong>{t('login.testCredentials')}</strong>
          </div>
          <p className="credentials-desc">{t('login.testCredentialsDesc')}</p>
          <div className="credentials-grid">
            <div className="credential-item">
              <span className="credential-role">{t('role.admin')}</span>
              <code className="credential-value">hala.alqahtani@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.doctor')}</span>
              <code className="credential-value">ahmed.alsaud@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.nurse')}</span>
              <code className="credential-value">noura.alharbi@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.labTech')}</span>
              <code className="credential-value">omar.alshammari@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.pharmacist')}</span>
              <code className="credential-value">layla.alghamdi@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.receptionist')}</span>
              <code className="credential-value">yousef.almutairi@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.radiologist')}</span>
              <code className="credential-value">khalid.alzahrani@hospital.com</code>
            </div>
          </div>
          <p className="credentials-note">{t('login.passwordBypassed')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">{t('login.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder={t('login.email')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('login.password')}</label>
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

        <Link to="/patient/login" className="btn btn-secondary btn-full">
          {t('login.patientLogin')}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
