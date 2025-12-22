import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Don't show back button on home page or base dashboard
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-button" onClick={handleBack} aria-label="Go back">
      <span className="back-icon">←</span>
      <span className="back-text">{t('common.back')}</span>
    </button>
  );
};

export default BackButton;

