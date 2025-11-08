import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  // 1. Obtenemos el estado de autenticación y el usuario
  const { isLoggedIn, user } = useAuth();

  // 2. Verificamos si el usuario es Admin
  // (Usamos 'Roles' con mayúscula, como lo envía C#)
  const isAdmin = user?.Roles?.includes('Admin');

  // 3. Si no está logueado O NO es Admin, redirigimos
  if (!isLoggedIn || !isAdmin) {
    // 'replace' asegura que la página actual no se guarde en el historial
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Si está logueado Y ES Admin, renderizamos la ruta
  return children;
};