import { useForm, useWatch } from 'react-hook-form';
import { useCustomerRegister } from '../../auth/hooks/useCustomerRegister';
import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';
import Toast from '../../shared/components/Toast';

export default function RegisterModal({ open, onClose, onRegisterSuccess, footer }) {
  const {
    isLoading,
    apiError,
    toastOpen,
    handleRegisterSubmit,
    handleToastClose,
  } = useCustomerRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({ mode: 'onChange' });

  const passwordValue = useWatch({ control, name: 'password' });

  const onSubmit = async (data) => {
    // 1. Esperamos y guardamos el resultado (true/false)
    const success = await handleRegisterSubmit(data);

    // 2. Solo llamamos a onRegisterSuccess (que abre el Login) SI el registro fue exitoso
    if (success && onRegisterSuccess) {
      onRegisterSuccess();
    }
    // Si 'success' es false, no hacemos nada, y la modal
    // mostrará el 'apiError' que seteó el hook.
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          onClick={(e) => e.stopPropagation()}
          className='bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative'
        >
          <button type="button" onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">Crear Cuenta</h2>

          <div className="space-y-4">
            <AuthInput
              label="Usuario"
              id="modal-reg-user"
              name="user"
              register={register}
              errors={errors}
              validationRules={{ required: 'El usuario es obligatorio' }}
              labelClassName="text-gray-700"
            />
            <AuthInput
              label="Email"
              id="modal-reg-email"
              name="email"
              type="email"
              register={register}
              errors={errors}
              validationRules={{
                required: 'El email es obligatorio',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido' },
              }}
              labelClassName="text-gray-700"
            />

            <AuthInput
              label="Contraseña"
              id="modal-reg-password"
              name="password"
              type="password"
              register={register}
              errors={errors}
              validationRules={{
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 8,
                  message: 'Mínimo 8 caracteres.',
                },
                validate: {
                  hasUpper: (value) =>
                    /(?=.*[A-Z])/.test(value) || 'Debe incluir al menos una mayúscula.',
                  hasLower: (value) =>
                    /(?=.*[a-z])/.test(value) || 'Debe incluir al menos una minúscula.',
                  hasDigit: (value) =>
                    /(?=.*\d)/.test(value) || 'Debe incluir al menos un número.',
                  hasSpecialChar: (value) =>
                    // eslint-disable-next-line no-useless-escape
                    /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value) || 'Debe incluir al menos un carácter especial.',
                },
              }}
              labelClassName="text-gray-700"
            />
            <AuthInput
              label="Confirmar contraseña"
              id="modal-reg-passwordConfirm"
              name="passwordConfirm"
              type="password"
              register={register}
              errors={errors}
              validationRules={{
                required: 'Debes confirmar la contraseña',
                validate: (value) => value === passwordValue || 'Las contraseñas no coinciden',
              }}
              labelClassName="text-gray-700"
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
              text="Registrarse"
              className="w-full cursor-pointer bg-purple-600 text-white rounded-lg p-2.5 transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-300"
            />
          </div>

          {footer}
        </form>
      </div>

      {/* Toast para feedback de registro */}
      <Toast
        open={toastOpen}
        title="¡Registro Exitoso!"
        message="Ahora puedes iniciar sesión."
        onClose={handleToastClose}
      />
    </>
  );
}