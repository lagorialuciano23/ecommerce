import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { loginService } from '../services/login.js';

/**
 * Hook personalizado que encapsula TODA la lógica de inicio de sesión.
 */

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);

  const { login: saveAuth } = useAuth(); // Renombramos 'login' a 'saveAuth'
  const navigate = useNavigate();

  /**
   * Función que se pasa al 'handleSubmit' de react-hook-form.
   * Ejecuta el servicio de login y maneja los estados.
   */
  const handleLoginSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const responseData = await loginService(data.user, data.password);

      const tokenString = responseData.token.Result || responseData.token;
      const userObject = responseData.user || { username: data.user };

      console.log('Token recibido (string):', tokenString);
      saveAuth(userObject, tokenString);
      setToastOpen(true); // Abre el toast en caso de éxito

    } catch (error) {
      setApiError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función para cerrar el toast y redirigir.
   */
  const handleToastClose = () => {
    setToastOpen(false);
    navigate('/admin', { replace: true });
  };

  // Exponemos los estados y las funciones que el componente necesita
  return {
    isLoading,
    apiError,
    toastOpen,
    handleLoginSubmit,
    handleToastClose,
  };
}