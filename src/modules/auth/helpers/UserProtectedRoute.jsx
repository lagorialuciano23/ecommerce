import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const UserProtectedRoute = ({ children, redirectPath = '/' }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // Si no está logueado, lo mandamos al inicio (donde puede abrir el modal de login)
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};