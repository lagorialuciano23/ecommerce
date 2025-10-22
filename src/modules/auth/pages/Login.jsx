import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState } from 'react';
import Toast from '../../shared/components/Toast';
function Login() {

  const navigate = useNavigate();
  //Obtener la funcion login del contexto
  const { login } = useAuth();
  const [toastOpen, setToastOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log(data);
    // 1. Marcar al usuario como logueado
    login(); //
    // 2. Abrir el Toast
    setToastOpen(true);

    // IMPORTANTE: Eliminamos la redirección inmediata de aquí.
    // La redirección se ejecutará en el onClose del Toast.
  };

  const handleToastClose = () => {
    // 1. Cerrar el toast
    setToastOpen(false);
    // 2. Redirigir a la ruta protegida solo DESPUÉS de que el toast se cierre
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
      {/* Reemplaza .login-container por clases de Tailwind */}
      {/* min-h-screen, flex, justify-center, items-center (fondo con gradiente no lo podemos migrar a clases simples de Tailwind sin usar utilitys personalizados o CSS) */}
      <div className="min-h-screen flex justify-center items-center bg-gray-900 bg-cover bg-fixed bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('/images/login-banner-utn.png')" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl flex flex-col gap-5 w-full max-w-sm shadow-xl border border-white border-opacity-20'
        >
          <div>
            {/* Reemplaza la etiqueta .label con clases de Tailwind */}
            <label htmlFor='user' className="block text-white mb-2">Usuario</label>
            {/* Reemplaza el input con clases de Tailwind */}
            <input
              className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('user', {
                required: 'El usuario es obligatorio',
                minLength: { value: 6, message: 'El usuario debe tener al menos 6 caracteres' },
              })} />
            {/* Usa la clase de error de Tailwind (text-red-500) */}
            {errors.user && <p className='text-red-500 pt-2 text-sm'>{errors.user.message}</p>}
          </div>

          <div>
            {/* Reemplaza la etiqueta .label con clases de Tailwind */}
            <label htmlFor='password'
              className='block text-white mb-2'
            >Contraseña</label>
            <input
              id='password'
              type='password'
              className='w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 9,
                  message: 'La contraseña debe tener al menos 9 caracteres',
                },
                pattern: {
                  // eslint-disable-next-line no-useless-escape
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,}$/,
                  message: 'Debe incluir al menos una mayúscula y un carácter especial.',
                },
              })}
            />
            {/* Mostramos error para el campo de contraseña también */}
            {errors.password && <p className='text-red-500 pt-2 text-sm'>{errors.password.message}</p>}
          </div>
          {/* Reemplaza el botón con clases de Tailwind. Usamos group y focus para el estado :disabled. */}
          <button
            className='w-full cursor-pointer bg-gray-200 text-gray-900 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
            type='submit'
            disabled={!isValid}
          >Enviar</button>

          <Toast
            open={toastOpen}
            title="¡Formulario enviado con éxito!"
            message="Bienvenido 👋"
            onClose={handleToastClose}
          />
        </form>
      </div>
    </>
  );
}

export default Login;
