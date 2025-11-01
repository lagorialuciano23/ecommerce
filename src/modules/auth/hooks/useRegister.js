import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../services/register.js';

/**
 * Hook personalizado que encapsula TODA la lógica de registro.
 */
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);

  const navigate = useNavigate();

  /**
   * Función que se pasa al 'handleSubmit' de react-hook-form.
   */
  const handleRegisterSubmit = async (data) => {
    setIsLoading(true);
    setApiError([]);

    try {
      // Llamamos al servicio con los 3 campos
      await registerService(data.user, data.email, data.password, data.role);

      // Si el servicio no lanzó error, fue un éxito
      setToastOpen(true); // Abre el toast

    } catch (error) {
      console.error(error);

      // Manejamos el nuevo tipo de error
      if (error.isApiError && Array.isArray(error.messages)) {
        // Si es nuestro error con un array de mensajes
        setApiError(error.messages);
      } else {
        // Si es un error genérico (de red, etc.)
        setApiError([error.message]); // Lo envolvemos en un array
      }
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