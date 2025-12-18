import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminOnlyRouteProps {
  children: React.ReactNode;
}

export const AdminOnlyRoute = ({ children }: AdminOnlyRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role_name !== 'Admin') {
    // Redirect to their appropriate page based on role
    const role = user?.role_name;
    if (role === 'Doctor') {
      return <Navigate to="/dashboard/my-appointments" replace />;
    } else if (role === 'Pharmacist') {
      return <Navigate to="/dashboard/prescriptions" replace />;
    } else if (role === 'Nurse') {
      return <Navigate to="/dashboard/patients" replace />;
    } else if (role === 'Receptionist') {
      return <Navigate to="/dashboard/appointments" replace />;
    } else {
      return <Navigate to="/dashboard/prescriptions" replace />;
    }
  }

  return <>{children}</>;
};

