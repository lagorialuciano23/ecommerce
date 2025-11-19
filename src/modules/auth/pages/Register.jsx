import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Toast from '../../shared/components/Toast';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthSelect from '../components/AuthSelect';
import { useRegister } from '../hooks/useRegister';

function Register() {
  const {
    isLoading,
    apiError,
    toastOpen,
    handleRegisterSubmit,
    handleToastClose,
  } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: 'onChange',
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  const roleOptions = [
    { value: 'User', label: 'Usuario' },
    { value: 'Admin', label: 'Administrador' },
  ];

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center text-black
        bg-gradient-to-br from-gray-300 via-gray-300 to-gray-400 bg-cover bg-fixed bg-center"
      >
        <form
          onSubmit={handleSubmit(handleRegisterSubmit)}
          className="bg-white text-black p-8 rounded-2xl
          flex flex-col
          p-6 md:p-10
          gap-4 md:gap-6
          w-full
          md:max-w-md mx-auto
          shadow-2xl border border-gray-200"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-4">
            <div className="bg-blue-500 p-4 rounded-full mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Registro de Usuario
            </h1>
            <p className="text-gray-500 text-sm">
              Complete los datos para crear su cuenta
            </p>
          </div>

          <div className="space-y-5">
            <Input
              label="Usuario"
              id="Username"
              name="user"
              register={register}
              errors={errors}
              autoComplete="username"
              validationRules={{
                required: 'El usuario es obligatorio',
                minLength: { value: 3, message: 'El usuario debe tener al menos 3 caracteres' },
              }}
            />

            <Input
              label="Email"
              id="Email"
              name="email"
              type="email"
              register={register}
              errors={errors}
              autoComplete="email"
              validationRules={{
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Formato de email inválido',
                },
              }}
            />

            <AuthSelect
              label="Rol"
              id="Role"
              name="role"
              register={register}
              errors={errors}
              options={roleOptions}
              validationRules={{ required: 'Debe seleccionar un rol' }}
            />

            <Input
              label="Contraseña"
              id="Password"
              name="password"
              type="password"
              register={register}
              errors={errors}
              autoComplete="new-password"
              validationRules={{
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
                validate: {
                  hasUpper: (v) => /(?=.*[A-Z])/.test(v) || 'Debe incluir al menos una mayúscula.',
                  hasDigit: (v) => /(?=.*\d)/.test(v) || 'Debe incluir al menos un número.',
                  hasSpecial: (v) =>
                    /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(v) ||
                    'Debe incluir al menos un carácter especial.',
                },
              }}
            />

            <Input
              label="Confirmar contraseña"
              id="PasswordConfirm"
              name="passwordConfirm"
              type="password"
              register={register}
              errors={errors}
              autoComplete="new-password"
              validationRules={{
                required: 'Debes confirmar la contraseña.',
                validate: (value) =>
                  value === passwordValue || 'Las contraseñas no coinciden',
              }}
            />
          </div>

          {apiError && (
            <div className="text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm flex items-center justify-center gap-2">
              <span className="font-medium">{apiError}</span>
            </div>
          )}

          <Button isLoading={isLoading} isValid={isValid} text="Crear Cuenta" />

          <div className="text-center text-gray-600 text-sm pt-2 border-t border-gray-200">
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
            >
              Iniciá sesión
            </Link>
          </div>
        </form>
      </div>

      <Toast
        open={toastOpen}
        title="¡Registro exitoso!"
        message="Ya puedes iniciar sesión con tu nueva cuenta."
        onClose={handleToastClose}
      />
    </>
  );
}

export default Register;
