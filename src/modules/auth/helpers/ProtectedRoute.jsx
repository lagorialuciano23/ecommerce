import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

//Componente que envuelve una ruta y redirige al usuario si no esta autenticado
export const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
//Obtenemos el estado de autenticacion
  const { isLoggedIn } = useAuth();

  //Si no está logueado, redirigimos a la ruta de login.
  if (!isLoggedIn) {
    //'replace' asegura que la página actual no se guarde en el historial
    return <Navigate to = {redirectPath} replace/>;
  }

  // Si está logueado, renderizamos el componente hijo (la ruta solicitada)
  return children;
};