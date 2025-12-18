import { Navigate } from 'react-router-dom';
import { patientAuthService } from '../services/patientAuth.service';

interface PatientProtectedRouteProps {
  children: React.ReactNode;
}

const PatientProtectedRoute = ({ children }: PatientProtectedRouteProps) => {
  const isAuthenticated = patientAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/patient/login" replace />;
  }

  return <>{children}</>;
};

export default PatientProtectedRoute;

