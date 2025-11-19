import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../../auth/context/useAuth';
import { loginService } from '../../auth/services/login';
import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';

// AÑADIMOS 'open' a las props
export default function LoginModal({ open, onClose, onLoginSuccess, footer }) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { login: saveAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Usamos el servicio de login
      const responseData = await loginService(data.user, data.password);

      // La lógica de tu hook 'useLogin'
      const tokenString = responseData.token.Result || responseData.token;
      const userObject = responseData.user || { username: data.user };

      saveAuth(userObject, tokenString);

      if (onLoginSuccess) onLoginSuccess();

      console.log('Login exitoso', userObject);
      console.log('Token', tokenString);
      onClose();

    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. AÑADIMOS ESTA LÍNEA
  // Si la prop 'open' es false, no renderizamos nada
  if (!open) return null;

  return (
    // Fondo oscuro (overlay)
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4"
    >
      {/* Contenido de la Modal (Fondo Blanco) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className='bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative'
      >
        {/* Botón de Cerrar (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
          Iniciar Sesión
        </h2>

        <div className="space-y-4">
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
            labelClassName="text-gray-700" // Color de label oscuro
          />

          <AuthInput
            label="Password" // "Password" como en la imagen
            id="modal-password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            autoComplete="current-password"
            validationRules={{
              required: 'La contraseña es obligatoria.',
            }}
            labelClassName="text-gray-700" // Color de label oscuro
          />
        </div>

        {apiError && (
          <p className='text-red-600 p-2 bg-red-100 rounded-lg text-center text-sm mt-4'>
            {apiError}
          </p>
        )}

        <div className="mt-6">
          <AuthSubmitButton
            isLoading={isLoading}
            isValid={isValid}
            text="Iniciar Sesión"
            // Botón con estilo morado
            className="w-full cursor-pointer bg-purple-600 text-white rounded-lg p-2.5 transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-300"
          />
        </div>

        {/* Renderiza el footer (ej. "¿No tenés cuenta? Registrate") */}
        {footer}

      </form>
    </div>
  );
}