import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Toast from '../../shared/components/Toast';
import Input from '../components/Input';
import Button from '../components/Button';
//Custom Hook
import { useLogin } from '../hooks/useLogin';

function Login() {
  const {
    isLoading,
    apiError,
    toastOpen,
    handleLoginSubmit,
    handleToastClose,
  } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  return (
    <>
      <div className="min-h-screen
         flex flex-col items-stretch
         justify-center items-center
         bg-gradient-to-br from-gray-300 via-gray-300 to-gray-400 bg-cover bg-fixed bg-center"
      >

        <form
          onSubmit={handleSubmit(handleLoginSubmit)}
          className='bg-white text-black p-8 rounded-2xl
          flex flex-col
          p-6 md:p-10
          gap-4 md:gap-6
          w-full
          md:max-w-md mx-auto
          shadow-2xl border border-gray-200'
        >
          {/* 'header' */}
          <div className="flex flex-col items-center mb-4">
            <div className="bg-blue-500 p-4 rounded-full mb-4 shadow-lg">
              {/* icono de escudito */}
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
              Modulo de admin
            </h1>
            <p className="text-gray-500 text-sm">
              Ingrese sus datos para iniciar sesión
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
              label="Contraseña"
              id="Password"
              name="password"
              type="password"
              register={register}
              errors={errors}
              autoComplete="current-password"
              validationRules={{
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
                pattern:{
                  // eslint-disable-next-line no-useless-escape
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                  message: 'Debe incluir al menos 1 mayúscula, 1 número y 1 carácter especial.',
                },
              }}
            />
          </div>

          {apiError && (
            <div className='text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm flex items-center justify-center gap-2'>
              <span className="font-medium">{apiError}</span>
            </div>
          )}

          <Button isLoading={isLoading} isValid={isValid} text="Iniciar Sesión" />

          <div className="text-center text-gray-600 text-sm pt-2 border-t border-gray-200">
            ¿No tenés cuenta?{' '}
            <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-600 transition-colors">
              Registrate
            </Link>
          </div>
        </form>
      </div>

      <Toast
        open={toastOpen}
        title="¡Inicio de sesión exitoso!"
        message="Bienvenido"
        onClose={handleToastClose}
      />
    </>
  );
}

export default Login;