import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { loginService } from '../services/login.js';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);

  const { login: saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const responseData = await loginService(data.user, data.password);

      console.log('========== DEBUG LOGIN ==========');
      console.log('Respuesta completa:', responseData);
      console.log('Usuario RAW:', responseData.user);

      const tokenString = responseData.token?.Result || responseData.token;
      
      // igual que en LoginModal
      const rawUser = responseData.user;
      const userObject = {
        id: rawUser.Id || rawUser.id,
        username: rawUser.Username || 'rawUser.username',
        email: rawUser.Email || rawUser.email,
        roles: rawUser.Roles || rawUser.roles || [], // ← ¡ESTO ES CLAVE!
      };

      console.log('Usuario mapeado:', userObject);
      console.log('Roles mapeados:', userObject.roles);

      // Validación de seguridad
      if (!userObject.id) {
        console.error('¡ALERTA! El ID del usuario es undefined. Respuesta:', rawUser);
        throw new Error('Error al iniciar sesión: No se pudo obtener el ID del usuario.');
      }

      saveAuth(userObject, tokenString);
      setToastOpen(true);

      // Redirigir después de 1.5 segundos (mientras se muestra el toast)
      setTimeout(() => {
        if (userObject.roles?.includes('Admin')) {
          console.log('Redirigiendo admin a /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('Redirigiendo usuario a /');
          navigate('/', { replace: true });
        }
      }, 1500);

    } catch (error) {
      setApiError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return {
    isLoading,
    apiError,
    toastOpen,
    handleLoginSubmit,
    handleToastClose,
  };
}