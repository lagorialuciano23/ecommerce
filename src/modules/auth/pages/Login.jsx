import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState } from 'react';
import Toast from '../../shared/components/Toast';
function Login() {

  const navigate = useNavigate();
  // 'login' ahora es la función que espera (userData, userToken)
  const { login } = useAuth();
  const [toastOpen, setToastOpen] = useState(false);
  // Nuevos Estados
  // Estado para manejar errores devueltos por el backend
  const [apiError, setApiError] = useState(null);
  // Estado para saber si la petición está en curso
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });
  // Convertimos onSubmit en una función asíncrona
  const onSubmit = async (data) => {
    console.log('Datos a enviar:', data);
    setApiError(null);
    setIsLoading(true);

    try {
      // 1. Llamamos al Backend usando fetch.
      // Usamos '/api/...' para que Vite use el proxy definido en vite.config.js
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.user,
          password: data.password,
        }),
      });

      // 2. Verificamos si la respuesta NO fue exitosa (ej. 401, 404, 500)
      if (!response.ok) {
        // Intentamos leer el mensaje de error del backend
        const errorData = await response.json();

        throw new Error(errorData.message || 'Credenciales incorrectas o error del servidor.');
      }

      // 3. Si la respuesta SÍ fue exitosa (ej. 200 OK)
      const responseData = await response.json();

      // Asumimos que el backend devuelve un objeto como:
      // { user: { id: 1, name: '...' }, token: 'jwt.token.aqui' }

      // 4. Llamamos a la función login del AuthContext con los datos recibidos
      login(responseData.user, responseData.token);

      // 5. Mostramos el Toast de éxito
      setToastOpen(true);

    } catch (error) {
      // 6. Si hubo un error (de red o del 'throw' de arriba)
      setApiError(error.message);
    } finally {
      // 7. Pase lo que pase, dejamos de cargar
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
      {/* Reemplaza .login-container por clases de Tailwind */}
      {/* min-h-screen, flex, justify-center, items-center (fondo con gradiente no lo podemos migrar a clases simples de Tailwind sin usar utilitys personalizados o CSS) */}
      <div className="min-h-screen
         flex flex-col items-stretch
         justify-center items-center
         bg-gray-900 bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('/images/login-banner-utn.png')" }}>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl
          flex flex-col
          p-6 md:p-8
          gap-4 md:gap-8
          w-full
          md:max-w-sm mx-auto
          shadow-xl border border-white border-opacity-20'
        >
          <div>
            {/* Reemplaza la etiqueta .label con clases de Tailwind */}
            <label htmlFor='Username' className="block text-white mb-2">Usuario</label>
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
            <label htmlFor='Password'
              className='block text-white mb-2'
            >Contraseña</label>
            <input
              id='Password'
              type='password'
              className='w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500'
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: {
                  value: 9,
                  message: 'La contraseña debe tener al menos 9 caracteres',
                },
                // pattern: {
                //   // eslint-disable-next-line no-useless-escape
                //   value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,}$/,
                //   message: 'Debe incluir al menos una mayúscula y un carácter especial.',
                // },
              })}
            />
            {/* Mostramos error para el campo de contraseña también */}
            {errors.password && <p className='text-red-500 pt-2 text-sm'>{errors.password.message}</p>}
          </div>
          {apiError && (
            <p className='text-red-400 p-2 bg-red-900 bg-opacity-50 rounded-lg text-center text-sm'>
              {apiError}
            </p>
          )}
          <button
            className='w-full cursor-pointer bg-gray-200 text-gray-900 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
            type='submit'
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Verificando...' : 'Enviar'}
          </button>
        </form>
        {errors && (
          <div className='mt-4 p-3 bg-red-800 rounded-lg text-white text-center w-full md:max-w-sm mx-auto'>
            {errors}
          </div>
        )}
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
