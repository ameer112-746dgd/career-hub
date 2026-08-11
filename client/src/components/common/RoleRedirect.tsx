import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirect;