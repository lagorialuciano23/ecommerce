// Importamos 'useWatch' para la validación de contraseñas
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Toast from '../../shared/components/Toast';
import AuthInput from '../components/Input';
import AuthSubmitButton from '../components/Button';
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
    control, // 1. Necesitamos 'control' para 'useWatch'
  } = useForm({
    mode: 'onChange',
  });

  // 2. 'useWatch' observa el valor del campo 'password'
  //    Esto es necesario para la validación de confirmación
  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  return (
    <>
      <div className="min-h-screen
         flex flex-col items-stretch
         justify-center items-center
         bg-gray-900 bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('/images/login-banner-utn.png')" }}>

        <form
          onSubmit={handleSubmit(handleRegisterSubmit)}
          className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl
          flex flex-col
          p-6 md:p-8
          gap-4 md:gap-8
          w-full
          md:max-w-sm mx-auto
          shadow-xl border border-white border-opacity-20'
        >
          <h1 className="text-center text-2xl font-semibold text-white mb-0">
            Registro de Usuario
          </h1>
          <AuthInput
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
          <div>
            <label htmlFor="Role" className="block text-white mb-2">Role</label>
            <select
              id="Role"
              className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('role', { required: 'Debe seleccionar un rol' })}
            >
              <option value="">Seleccione una opción</option>
              <option value="User">Usuario</option>
              <option value="Admin">Administrador</option>
            </select>
            {errors.role && (
              <p className='text-red-500 pt-2 text-sm'>{errors.role.message}</p>
            )}
          </div>
          <AuthInput
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
                message: 'Mínimo 8 caracteres.',
              },
              // 1. Usamos 'validate' para múltiples reglas personalizadas
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
          />

          <AuthInput
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

          {apiError && (
            <p className='text-red-400 p-2 bg-red-900 bg-opacity-50 rounded-lg text-center text-sm'>
              {apiError}
            </p>
          )}

          <AuthSubmitButton isLoading={isLoading} isValid={isValid} text="Crear Cuenta" />

          <div className="text-center text-white text-sm mt-4">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Inicia Sesión
            </Link>
          </div>
        </form>
      </div>

      <Toast
        open={toastOpen}
        title="¡Registro Exitoso!"
        message="Ya puedes iniciar sesión con tu nueva cuenta."
        onClose={handleToastClose}
      />
    </>
  );
}

export default Register;