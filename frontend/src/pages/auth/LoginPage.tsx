import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import type { LoginRequest } from '@/types';
import LanguageToggle from '@/components/LanguageToggle';
import { getRoleDashboard } from '@/utils/roleRedirect';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect after successful login
  useEffect(() => {
    if (loginSuccess && user?.role_name) {
      const dashboardRoute = getRoleDashboard(user.role_name);
      navigate(dashboardRoute);
      setLoginSuccess(false);
    }
  }, [loginSuccess, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials: LoginRequest = { email, password };
      await login(credentials);
      setLoginSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <button onClick={handleBackToHome} className="login-back-button" aria-label="Go to home">
            <span className="back-icon">←</span>
            <span className="back-text">{t('common.home')}</span>
          </button>
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
              <code className="credential-value">hala.ahmed@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.doctor')}</span>
              <code className="credential-value">abdallah.mohamed@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.nurse')}</span>
              <code className="credential-value">nour.hassan@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.labTech')}</span>
              <code className="credential-value">omar.sayed@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.pharmacist')}</span>
              <code className="credential-value">layla.ibrahim@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.receptionist')}</span>
              <code className="credential-value">youssef.mostafa@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.radiologist')}</span>
              <code className="credential-value">khaled.mahmoud@hospital.com</code>
            </div>
            <div className="credential-item">
              <span className="credential-role">{t('role.databaseAdmin')}</span>
              <code className="credential-value">db.admin@hospital.com</code>
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
