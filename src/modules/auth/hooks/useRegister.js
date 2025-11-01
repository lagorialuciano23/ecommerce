import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../services/register.js';

/**
 * Hook personalizado que encapsula TODA la lógica de registro.
 */
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState();
  const [toastOpen, setToastOpen] = useState(false);

  const navigate = useNavigate();

  /**
   * Función que se pasa al 'handleSubmit' de react-hook-form.
   */
  const handleRegisterSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Llamamos al servicio con los 3 campos
      await registerService(data.user, data.email, data.password, data.role);

      // Si el servicio no lanzó error, fue un éxito
      setToastOpen(true); // Abre el toast

    } catch (error) {
      console.error(error);

      // 3. Guardamos el 'error.message' (que ahora es un string)
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función para cerrar el toast y redirigir al Login.
   */
  const handleToastClose = () => {
    setToastOpen(false);
    navigate('/login', { replace: true });
  };

  // Exponemos los estados y las funciones que el componente necesita
  return {
    isLoading,
    apiError,
    toastOpen,
    handleRegisterSubmit,
    handleToastClose,
  };
}