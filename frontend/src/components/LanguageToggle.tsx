import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-toggle">
      <button
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'active' : ''}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={language === 'ar' ? 'active' : ''}
        title="العربية"
      >
        AR
      </button>
    </div>
  );
};

export default LanguageToggle;

