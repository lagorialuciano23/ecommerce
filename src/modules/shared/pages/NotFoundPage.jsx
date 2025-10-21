import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';

function NotFoundPage() {
  const navigate = useNavigate();
  // Obtenemos el estado de autenticación
  const { isLoggedIn } = useAuth();

  // Determinamos la ruta de redirección
  const homePath = isLoggedIn ? '/dashboard' : '/login';

  const handleRedirect = () => {
    // Redirigimos al usuario a la ruta correspondiente
    navigate(homePath, { replace: true });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'white',
      textAlign: 'center',
    }}>
      <h1>Error 404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        ¡Página no encontrada!
      </p>
      <button
        onClick={handleRedirect}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#263e77',
          color: 'white',
        }}
      >
        Volver al {isLoggedIn ? 'Dashboard' : 'Inicio de Sesión'}
      </button>
    </div>
  );
}
export default NotFoundPage;