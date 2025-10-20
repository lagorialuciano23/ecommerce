import { useForm } from 'react-hook-form';

function Login() {
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
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,}$/,
                  message: 'Debe incluir al menos una mayúscula y un carácter especial.',
                },
              })}
            />
            {/* Mostramos error para el campo de contraseña también */}
            {errors.password && <p className='error-message'>{errors.password.message}</p>}
          </div>
          <button type='submit' disabled={!isValid}>Enviar</button>
        </form>
      </div>
    </>
  );
}

export default Login;
