import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Login() {

  const navigate = useNavigate();
  //Obtener la funcion login del contexto
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log(data);
    alert('¡Formulario enviado con éxito!');
    // 1. Marcar al usuario como logueado
    login(); //

    // 2. Redirigir a la ruta protegida
    navigate('/dashboard', { replace : true }); //
    reset();
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='user'>Usuario</label>
            <input {...register('user', {
              required: 'El usuario es obligatorio',
              minLength: { value: 6, message: 'El usuario debe tener al menos 6 caracteres' },
            })} />
            {/* Mostramos error para el campo de usuario también */}
            {errors.user && <p className='error-message'>{errors.user.message}</p>}
          </div>

          <div>
            <label htmlFor='password'>Contraseña</label>
            <input
              id='password'
              type='password'
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
            {errors.password && <p className='error-message'>{errors.password.message}</p>}
          </div>
          <button className='button-login' type='submit' disabled={!isValid}>Enviar</button>
        </form>
      </div>
    </>
  );
}

export default Login;
