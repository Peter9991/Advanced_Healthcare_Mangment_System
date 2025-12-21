import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <span className="back-text">Back</span>
    </button>
  );
};

export default BackButton;

