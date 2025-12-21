import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roleRedirect';

interface DatabaseAdminOnlyRouteProps {
  children: React.ReactNode;
}

export const DatabaseAdminOnlyRoute = ({ children }: DatabaseAdminOnlyRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role_name !== 'Database Administrator') {
    const dashboardRoute = getRoleDashboard(user?.role_name);
    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
};

