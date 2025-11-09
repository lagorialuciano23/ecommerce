import { useState } from 'react';
import { registerCustomerService } from '../services/registerCustomer.js';

/**
 * Hook personalizado para la MODAL de registro de Clientes.
 */
export function useCustomerRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState();
  const [toastOpen, setToastOpen] = useState(false);

  const handleRegisterSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // 1. Llamamos al NUEVO servicio (solo 3 campos)
      await registerCustomerService(data.user, data.email, data.password);
      setToastOpen(true);

    } catch (error) {
      console.error(error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
    // No redirigimos, solo cerramos el toast.
  };

  return {
    isLoading,
    apiError,
    toastOpen,
    handleRegisterSubmit,
    handleToastClose,
  };
}