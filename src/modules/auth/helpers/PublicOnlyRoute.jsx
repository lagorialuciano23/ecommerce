// src/modules/auth/helpers/PublicOnlyRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  console.log('Verificando acceso público');
  console.log('Usuario:', user);
  console.log('Roles:', user?.roles);

  // Si esta logueado Y es Admin, redirige al panel de admin
  if (isLoggedIn && user?.roles?.includes('Admin')) {
    console.log('User con rol Admin detectado, redirigiendo a /admin');
    return <Navigate to="/admin" replace />;
  }

  // Si no es Admin (o no esta logueado), permite acceso    
  return children;
};