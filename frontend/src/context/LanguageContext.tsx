import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.patients': 'Patients',
    'nav.doctors': 'Doctors',
    'nav.appointments': 'Appointments',
    'nav.prescriptions': 'Prescriptions',
    'nav.medicalRecords': 'Medical Records',
    'nav.labResults': 'Lab Results',
    'nav.billing': 'Billing',
    'nav.facilities': 'Facilities',
    'nav.logout': 'Logout',
    
    // Login
    'login.title': 'Healthcare Management System',
    'login.staffLogin': 'Staff Login',
    'login.patientLogin': 'Patient Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.loggingIn': 'Logging in...',
    'login.testCredentials': 'Test Credentials',
    'login.testCredentialsDesc': 'Test Credentials (any password):',
    'login.passwordBypassed': 'Password validation bypassed for testing',
    'login.loginAsPatient': 'Login as Patient',
    'login.loginAsStaff': 'Login as Staff',
    'login.or': 'OR',
    
    // Patient Login
    'patientLogin.title': 'Patient Login',
    'patientLogin.nationalId': 'National ID',
    'patientLogin.useEmail': 'Use Email instead of National ID',
    'patientLogin.testNationalId': 'National ID:',
    'patientLogin.testEmail': 'Or Email:',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.actions': 'Actions',
    'common.required': 'Required',
    
    // Pages
    'page.newPatient': 'New Patient',
    'page.newAppointment': 'New Appointment',
    'page.newPrescription': 'New Prescription',
    'page.newLabOrder': 'New Lab Order',
    
    // Forms
    'form.required': 'Required',
    'form.select': 'Select...',
    
    // Roles
    'role.admin': 'Admin',
    'role.doctor': 'Doctor',
    'role.nurse': 'Nurse',
    'role.labTech': 'Lab Tech',
    'role.pharmacist': 'Pharmacist',
    'role.receptionist': 'Receptionist',
    'role.radiologist': 'Radiologist',
    'role.databaseAdmin': 'Database Admin',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.patients': 'المرضى',
    'nav.doctors': 'الأطباء',
    'nav.appointments': 'المواعيد',
    'nav.prescriptions': 'الوصفات الطبية',
    'nav.medicalRecords': 'السجلات الطبية',
    'nav.labResults': 'نتائج المختبر',
    'nav.billing': 'الفواتير',
    'nav.facilities': 'المرافق',
    'nav.logout': 'تسجيل الخروج',
    
    // Login
    'login.title': 'نظام إدارة الرعاية الصحية',
    'login.staffLogin': 'تسجيل دخول الموظفين',
    'login.patientLogin': 'تسجيل دخول المريض',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.submit': 'تسجيل الدخول',
    'login.loggingIn': 'جاري تسجيل الدخول...',
    'login.testCredentials': 'بيانات الاختبار',
    'login.testCredentialsDesc': 'بيانات الاختبار (أي كلمة مرور):',
    'login.passwordBypassed': 'تم تجاوز التحقق من كلمة المرور للاختبار',
    'login.loginAsPatient': 'تسجيل الدخول كمرض',
    'login.loginAsStaff': 'تسجيل الدخول كموظف',
    'login.or': 'أو',
    
    // Patient Login
    'patientLogin.title': 'تسجيل الدخول للمريض',
    'patientLogin.nationalId': 'رقم الهوية الوطنية',
    'patientLogin.useEmail': 'استخدم البريد الإلكتروني بدلاً من رقم الهوية',
    'patientLogin.testNationalId': 'رقم الهوية:',
    'patientLogin.testEmail': 'أو البريد الإلكتروني:',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.search': 'بحث',
    'common.actions': 'الإجراءات',
    'common.required': 'مطلوب',
    
    // Pages
    'page.newPatient': 'مريض جديد',
    'page.newAppointment': 'موعد جديد',
    'page.newPrescription': 'وصفة طبية جديدة',
    'page.newLabOrder': 'طلب مختبر جديد',
    
    // Forms
    'form.required': 'مطلوب',
    'form.select': 'اختر...',
    
    // Roles
    'role.admin': 'مدير',
    'role.doctor': 'طبيب',
    'role.nurse': 'ممرض',
    'role.labTech': 'فني مختبر',
    'role.pharmacist': 'صيدلي',
    'role.receptionist': 'موظف استقبال',
    'role.radiologist': 'أخصائي أشعة',
    'role.databaseAdmin': 'مدير قاعدة البيانات',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
