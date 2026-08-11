import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center">Verifying session...</div>;
  }

  // If not logged in, send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role isn't allowed, send to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Use Outlet because we are using ProtectedRoute as a wrapper in App.tsx
  return <Outlet />;
};

export default ProtectedRoute;