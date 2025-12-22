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
    'common.back': 'Back',
    'common.home': 'Home',
    
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
    
    // Home Page
    'home.heroSubtitle': 'Comprehensive solution for managing patients, appointments, medical records, and hospital operations',
    'home.keyFeatures': 'Key Features',
    'home.feature.patientManagement.title': 'Patient Management',
    'home.feature.patientManagement.desc': 'Complete patient records management including personal information, medical history, insurance details, and contact information.',
    'home.feature.doctorStaff.title': 'Doctor & Staff',
    'home.feature.doctorStaff.desc': 'Manage doctor profiles, specialties, schedules, and staff assignments across different departments.',
    'home.feature.appointments.title': 'Appointments',
    'home.feature.appointments.desc': 'Schedule and manage appointments with automated reminders, availability tracking, and status management.',
    'home.feature.medicalRecords.title': 'Medical Records',
    'home.feature.medicalRecords.desc': 'Digital medical records with diagnoses, treatments, vital signs, and comprehensive patient history tracking.',
    'home.feature.prescriptions.title': 'Prescriptions',
    'home.feature.prescriptions.desc': 'Electronic prescription management with medication tracking, refills, and pharmacy integration.',
    'home.feature.labDiagnostics.title': 'Lab & Diagnostics',
    'home.feature.labDiagnostics.desc': 'Laboratory test orders, results management, radiology imaging, and diagnostic report tracking.',
    'home.feature.billingFinance.title': 'Billing & Finance',
    'home.feature.billingFinance.desc': 'Invoice generation, payment processing, insurance claims, and financial reporting.',
    'home.feature.facilities.title': 'Facilities',
    'home.feature.facilities.desc': 'Room and bed management, admissions, surgical procedures, and operation theater bookings.',
    'home.whyChoose': 'Why Choose Our System?',
    'home.benefit.secure.title': '🔒 Secure & Compliant',
    'home.benefit.secure.desc': 'Role-based access control, data encryption, and HIPAA-compliant security measures',
    'home.benefit.fast.title': '⚡ Fast & Efficient',
    'home.benefit.fast.desc': 'Streamlined workflows reduce administrative time and improve patient care',
    'home.benefit.reporting.title': '📊 Comprehensive Reporting',
    'home.benefit.reporting.desc': 'Real-time analytics and reports for better decision-making',
    'home.benefit.integrated.title': '🔄 Integrated System',
    'home.benefit.integrated.desc': 'All modules work together seamlessly for complete healthcare management',
    'home.readyToStart': 'Ready to Get Started?',
    'home.readyToStartDesc': 'Access the system with your credentials to begin managing your healthcare operations',
    'home.loginToSystem': 'Login to System',
    'home.footer': '© 2024 Healthcare Management System. All rights reserved.',
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
    'common.back': 'رجوع',
    'common.home': 'الرئيسية',
    
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
    
    // Home Page
    'home.heroSubtitle': 'حل شامل لإدارة المرضى والمواعيد والسجلات الطبية وعمليات المستشفى',
    'home.keyFeatures': 'الميزات الرئيسية',
    'home.feature.patientManagement.title': 'إدارة المرضى',
    'home.feature.patientManagement.desc': 'إدارة كاملة لسجلات المرضى بما في ذلك المعلومات الشخصية والتاريخ الطبي وتفاصيل التأمين ومعلومات الاتصال.',
    'home.feature.doctorStaff.title': 'الأطباء والموظفين',
    'home.feature.doctorStaff.desc': 'إدارة ملفات الأطباء والتخصصات والجداول الزمنية وتعيينات الموظفين عبر الأقسام المختلفة.',
    'home.feature.appointments.title': 'المواعيد',
    'home.feature.appointments.desc': 'جدولة وإدارة المواعيد مع تذكيرات تلقائية وتتبع التوفر وإدارة الحالة.',
    'home.feature.medicalRecords.title': 'السجلات الطبية',
    'home.feature.medicalRecords.desc': 'سجلات طبية رقمية مع التشخيصات والعلاجات وعلامات Vital وتتبع شامل لتاريخ المريض.',
    'home.feature.prescriptions.title': 'الوصفات الطبية',
    'home.feature.prescriptions.desc': 'إدارة الوصفات الطبية الإلكترونية مع تتبع الأدوية والتجديدات وتكامل الصيدلية.',
    'home.feature.labDiagnostics.title': 'المختبر والتشخيص',
    'home.feature.labDiagnostics.desc': 'طلبات الفحوصات المخبرية وإدارة النتائج والتصوير الإشعاعي وتتبع تقارير التشخيص.',
    'home.feature.billingFinance.title': 'الفواتير والمالية',
    'home.feature.billingFinance.desc': 'إنشاء الفواتير ومعالجة المدفوعات ومطالبات التأمين والتقارير المالية.',
    'home.feature.facilities.title': 'المرافق',
    'home.feature.facilities.desc': 'إدارة الغرف والأسرّة والقبول والإجراءات الجراحية وحجوزات غرف العمليات.',
    'home.whyChoose': 'لماذا تختار نظامنا؟',
    'home.benefit.secure.title': '🔒 آمن ومتوافق',
    'home.benefit.secure.desc': 'التحكم في الوصول القائم على الأدوار وتشفير البيانات وإجراءات الأمان المتوافقة مع HIPAA',
    'home.benefit.fast.title': '⚡ سريع وفعال',
    'home.benefit.fast.desc': 'تبسيط سير العمل يقلل من الوقت الإداري ويحسن رعاية المرضى',
    'home.benefit.reporting.title': '📊 تقارير شاملة',
    'home.benefit.reporting.desc': 'التحليلات والتقارير في الوقت الفعلي لاتخاذ قرارات أفضل',
    'home.benefit.integrated.title': '🔄 نظام متكامل',
    'home.benefit.integrated.desc': 'تعمل جميع الوحدات معًا بسلاسة لإدارة صحية كاملة',
    'home.readyToStart': 'هل أنت مستعد للبدء؟',
    'home.readyToStartDesc': 'قم بالوصول إلى النظام باستخدام بيانات اعتمادك لبدء إدارة عمليات الرعاية الصحية الخاصة بك',
    'home.loginToSystem': 'تسجيل الدخول إلى النظام',
    'home.footer': '© 2024 نظام إدارة الرعاية الصحية. جميع الحقوق محفوظة.',
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
