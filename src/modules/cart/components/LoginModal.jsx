import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../../auth/context/useAuth';
import { loginService } from '../../auth/services/login';
import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';

/**
 * Componente Modal para login.
 * Recibe 'onClose' para cerrar la modal y 'onLoginSuccess'
 * para ejecutar una acción después de un login exitoso.
 */
export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { login: saveAuth } = useAuth(); // Función del AuthContext

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const responseData = await loginService(data.user, data.password);

      const tokenString = responseData.token.Result || responseData.token;
      const userObject = responseData.user || { username: data.user };

      // 1. Guardar la sesión en el AuthContext
      saveAuth(userObject, tokenString);

      // 2. Ejecutar la acción de éxito (ej. enviar el formulario de la orden)
      onLoginSuccess();

      // 3. Cerrar la modal
      onClose();

    } catch (error) {
      setApiError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fondo oscuro (overlay)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Cierra la modal si se hace clic fuera
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        // Detiene la propagación del clic para no cerrar la modal al hacer clic en el formulario
        onClick={(e) => e.stopPropagation()}
        className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl
          flex flex-col
          p-6 md:p-8
          gap-4 md:gap-8
          w-full
          md:max-w-sm mx-auto
          shadow-xl border border-white border-opacity-20'
      >
        <h2 className="text-center text-2xl font-semibold text-white mb-0">
          Inicia Sesión para Continuar
        </h2>

        <AuthInput
          label="Usuario"
          id="modal-user"
          name="user"
          register={register}
          errors={errors}
          autoComplete="username"
          validationRules={{
            required: 'El usuario es obligatorio',
          }}
        />

        <AuthInput
          label="Contraseña"
          id="modal-password"
          name="password"
          type="password"
          register={register}
          errors={errors}
          autoComplete="current-password"
          validationRules={{
            required: 'La contraseña es obligatoria.',
          }}
        />

        {apiError && (
          <p className='text-red-400 p-2 bg-red-900 bg-opacity-50 rounded-lg text-center text-sm'>
            {apiError}
          </p>
        )}

        <AuthSubmitButton isLoading={isLoading} isValid={isValid} text="Iniciar Sesión" />
      </form>
    </div>
  );
}