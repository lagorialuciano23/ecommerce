import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoute = ({ children, redirectPath = '/login', allowedRoles = [] }) => {
  // 1. Obtenemos el estado de autenticación y el usuario
  const { isLoggedIn, hasRole, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si se especifican roles permitidos y el usuario no tiene ninguno
  if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
    return <Navigate to="/" replace />; // O a una página de "No autorizado"
  }

  // 4. Si está logueado Y ES Admin, renderizamos la ruta
  return children;
};