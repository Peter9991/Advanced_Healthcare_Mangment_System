/**
 * Get the default dashboard route for a user based on their role
 */
export const getRoleDashboard = (roleName: string | undefined | null): string => {
  if (!roleName) {
    return '/login';
  }

  switch (roleName) {
    case 'Admin':
      return '/dashboard';
    case 'Doctor':
      return '/dashboard/my-appointments';
    case 'Nurse':
      return '/dashboard/patients';
    case 'Lab Technician':
    case 'Radiologist':
      return '/dashboard/lab-results';
    case 'Pharmacist':
      return '/dashboard/prescriptions';
    case 'Receptionist':
      return '/dashboard/appointments';
    case 'Accountant':
      return '/dashboard/billing';
    case 'Database Administrator':
      return '/dashboard/database-admin';
    default:
      return '/dashboard';
  }
};

