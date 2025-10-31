// {
//   "Username": "dybalux",
//   "Email": "luchicapo@gmail.com",
//   "Password": "StarPlatinum2!"
//    Es usuario Admin
// }
// admin: Gabriel GabrielMoeykens7# / user:FranciscoVicente FranciscoVicente1.

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Toast from '../../shared/components/Toast';
import Input from '../components/Input';
import Button from '../components/Button';
//Custom Hook
import { useLogin } from '../hooks/useLogin';

function Login() {  
  // Extraemos toda la lógica del Hook
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

  // Convertimos onSubmit en una función asíncrona
  const onSubmit = async (data) => {
    console.log('Datos a enviar (hook-form):', data);
    setApiError(null);
    setIsLoading(true);

    const requestBody = {
      Username: data.user,
      Password: data.password,
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Enviamos el body corregido
      });

      // --- MANEJO DE ERRORES MEJORADO ---
      if (!response.ok) {
        let errorText = `Error ${response.status}: ${response.statusText}`; // Mensaje por defecto

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();

          // Tu backend devuelve un string simple en caso de 401, no un JSON
          // Lo ajustamos para leer 'errorData' directamente si es un string
          if (typeof errorData === 'string') {
            errorText = errorData; // Ej: "Usuario o Contraseña Incorrectos"
          } else {
            errorText = errorData.message || 'Credenciales incorrectas.';
          }
        } else if (response.status === 401) {
          errorText = 'Usuario o Contraseña Incorrectos.';
        } else {
          errorText = `Error ${response.status}: Falla interna del servidor. Revisa la consola del backend.`;
        }

        throw new Error(errorText);
      }
      // --- FIN DEL MANEJO DE ERRORES ---

      // 3. Si la respuesta SÍ fue exitosa (ej. 200 OK)
      const responseData = await response.json();

      // Extraemos el token del objeto 'Result'
      const tokenString = responseData.token.Result;

      console.log('Token recibido (string):', tokenString);

      // 4. Llamamos a la función login del AuthContext

      const userFromToken = { username: data.user }; // Objeto temporal

      login(responseData.user || userFromToken, tokenString);

      //Muestro el token por consola
      console.log('Token recibido:', responseData.token);

      // 5. Mostramos el Toast de éxito
      setToastOpen(true);

    } catch (error) {
      // 6. Si hubo un error (de red o del 'throw' de arriba)
      const message = error.message.includes('Failed to fetch')
        ? 'No se pudo conectar con el servidor. Revisa la consola.'
        : error.message;

      setApiError(message);
      console.error(error);
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
              minLength: { value: 6, message: 'El usuario debe tener al menos 6 caracteres' },
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
                value: 9,
                message: 'La contraseña debe tener al menos 9 caracteres',
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