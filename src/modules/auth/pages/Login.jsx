// {
//   "Username": "dybalux",
//   "Email": "luchicapo@gmail.com",
//   "Password": "StarPlatinum2!"
//    Es usuario Admin
// }
// admin: Gabriel GabrielMoeykens7# / user:FranciscoVicente FranciscoVicente1.

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../../shared/components/Toast';
import Input from '../components/Input';
import Button from '../components/Button';
//Importamos el servicios
import { loginService } from '../services/login';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [toastOpen, setToastOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
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
    console.log('Datos a enviar (hook-form):', data);
    setApiError(null);
    setIsLoading(true);
    try {
      // 3. Llamamos al servicio con los datos del formulario
      const responseData = await loginService(data.user, data.password);

      // 4. Procesamos la respuesta exitosa
      // Corregimos el bug del token que venía como Task<string> (objeto 'Result')
      const tokenString = responseData.token.Result || responseData.token;

      // Creamos un usuario temporal si el backend no lo devuelve
      const userObject = responseData.user || { username: data.user };

      console.log('Token recibido (string):', tokenString);

      // 5. Llamamos al 'login' del AuthContext para guardar la sesión
      login(userObject, tokenString);

      setToastOpen(true);

    } catch (error) {
      // 6. Si el servicio lanzó un error, lo mostramos
      setApiError(error.message);
      console.error(error);
    } finally {
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
          onSubmit={handleSubmit(onSubmit)}
          className='bg-gray-800 bg-opacity-10 backdrop-blur-md p-8 rounded-xl
          flex flex-col
          p-6 md:p-8
          gap-4 md:gap-8
          w-full
          md:max-w-sm mx-auto
          shadow-xl border border-white border-opacity-20'
        >

          {/* 2. REEMPLAZAMOS los inputs antiguos por el nuevo componente */}

          <Input
            label="Usuario"
            id="Username"
            name="user" // El 'name' para react-hook-form
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
            name="password" // El 'name' para react-hook-form
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

          {/* 3. El resto del formulario (error y botón) sigue igual */}
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