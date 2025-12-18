import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import './Layout.css';

const menuTranslations: Record<string, { en: string; ar: string }> = {
  'Dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'Patients': { en: 'Patients', ar: 'المرضى' },
  'My Patients': { en: 'My Patients', ar: 'مرضاي' },
  'Doctors': { en: 'Doctors', ar: 'الأطباء' },
  'Appointments': { en: 'Appointments', ar: 'المواعيد' },
  'My Appointments': { en: 'My Appointments', ar: 'مواعيدي' },
  'Prescriptions': { en: 'Prescriptions', ar: 'الوصفات الطبية' },
  'Medical Records': { en: 'Medical Records', ar: 'السجلات الطبية' },
  'Lab Results': { en: 'Lab Results', ar: 'نتائج المختبر' },
  'Billing': { en: 'Billing', ar: 'الفواتير' },
  'My Earnings': { en: 'My Earnings', ar: 'أرباحي' },
  'Facilities': { en: 'Facilities', ar: 'المرافق' },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Role-based menu items
  const getMenuItems = () => {
    const role = user?.role_name;
    const allItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin'] },
      { path: '/dashboard/patients', label: 'Patients', icon: '👥', roles: ['Admin', 'Nurse', 'Receptionist'] },
      { path: '/dashboard/my-patients', label: 'My Patients', icon: '👥', roles: ['Doctor'] },
      { path: '/dashboard/doctors', label: 'Doctors', icon: '👨‍⚕️', roles: ['Admin', 'Receptionist'] },
      { path: '/dashboard/appointments', label: 'Appointments', icon: '📅', roles: ['Admin', 'Nurse', 'Receptionist'] },
      { path: '/dashboard/my-appointments', label: 'My Appointments', icon: '📅', roles: ['Doctor'] },
      { path: '/dashboard/prescriptions', label: 'Prescriptions', icon: '💊', roles: ['Admin', 'Pharmacist'] },
      { path: '/dashboard/medical-records', label: 'Medical Records', icon: '📋', roles: ['Admin', 'Nurse'] },
      { path: '/dashboard/lab-results', label: 'Lab Results', icon: '🧪', roles: ['Admin', 'Lab Technician', 'Radiologist'] },
      { path: '/dashboard/billing', label: 'Billing', icon: '💰', roles: ['Admin', 'Accountant', 'Receptionist'] },
      { path: '/dashboard/my-earnings', label: 'My Earnings', icon: '💰', roles: ['Doctor'] },
      { path: '/dashboard/facilities', label: 'Facilities', icon: '🏥', roles: ['Admin'] },
    ];

    // Filter by role - doctor-specific pages only for Doctor role
    return allItems.filter(item => item.roles.includes(role || ''));
  };

  const menuItems = getMenuItems();

  const getTranslatedLabel = (label: string): string => {
    const translation = menuTranslations[label];
    return translation ? translation[language] : label;
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🏥 HMS</h2>
          <p className="sidebar-subtitle">{language === 'ar' ? 'إدارة الرعاية الصحية' : 'Healthcare Management'}</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{getTranslatedLabel(item.label)}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.first_name} {user?.last_name}</p>
              <p className="user-role">{user?.role_name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1 className="page-title">
            {getTranslatedLabel(menuItems.find(item => isActive(item.path))?.label || 'Dashboard')}
          </h1>
          <LanguageToggle />
        </header>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

