import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roleRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user tries to access /dashboard directly, redirect to their role-specific dashboard
  if (location.pathname === '/dashboard' && user?.role_name !== 'Admin') {
    const dashboardRoute = getRoleDashboard(user?.role_name);
    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
};

