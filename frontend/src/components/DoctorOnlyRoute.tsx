import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DoctorOnlyRouteProps {
  children: React.ReactNode;
}

export const DoctorOnlyRoute = ({ children }: DoctorOnlyRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role_name !== 'Doctor') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

