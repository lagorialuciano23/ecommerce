// {
//   "Username": "dybalux",
//   "Email": "luchicapo@gmail.com",
//   "Password": "StarPlatinum2!"
//    Es usuario Admin
// }
// {
//   "Username": "milo",
//   "Email": "milo@milo.com",
//   "Password": "StarPlatinum23!"
// }

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Toast from '../../shared/components/Toast';
import Input from '../components/Input';
import Button from '../components/Button';
//Custom Hook
import { useLogin } from '../hooks/useLogin';

function Login() {  
  // 1. Extraemos toda la lógica del Hook (¡ESTO ES TODO LO QUE NECESITAS!)
  const {
    isLoading,
    apiError,
    toastOpen,
    handleLoginSubmit, // <-- Esta función ya hace el fetch, llama al AuthContext, etc.
    handleToastClose,  // <-- Esta función ya cierra el toast y navega
  } = useLogin();

  // 2. Lógica de react-hook-form
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
         bg-gray-900 bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('/images/login-banner-utn.png')" }}>

        <form
          onSubmit={handleSubmit(handleLoginSubmit)}
          className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl
          flex flex-col
          p-6 md:p-8
          gap-4 md:gap-8
          w-full
          md:max-w-sm mx-auto
          shadow-xl border border-white border-opacity-20'
        >

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

          {apiError && (
            <p className='text-red-400 p-2 bg-red-900 bg-opacity-50 rounded-lg text-center text-sm'>
              {apiError}
            </p>
          )}

          <Button isLoading={isLoading} isValid={isValid} text="Enviar" />

          <div className="text-center text-white text-sm mt-4">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
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