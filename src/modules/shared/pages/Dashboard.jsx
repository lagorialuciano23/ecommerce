import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';

function Dashboard() {
  const navigate = useNavigate();
  // Extraemos la función logout del contexto
  const { logout } = useAuth();

  const handleLogout = () => {
    // Llamamos a la función de logout para actualizar el estado
    logout();
    // Redirigimos al usuario a la página de login
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-container">
      <nav>
        <ul>
          <li>hola</li>
          <li>como</li>
          <li>estas</li>
        </ul>
      </nav>
      <header>
        Header
        {/* Añadimos el botón de Cerrar Sesión en el Header */}
        <button
          onClick={handleLogout}
          // Usamos una clase simple o la definimos en dashboard.css
          className='logout-button'
          style={{
            padding: '8px 15px',
            cursor: 'pointer',
            backgroundColor: '#ff4d4f', // Color distintivo para el botón de salir
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Cerrar Sesión
        </button>
      </header>
      <main>
        <div className="card">Card 1</div>
        <div className="card">Card 2</div>
        <div className="card">Card 3</div>
      </main>
      <footer>Mi footer</footer>
    </div>
  );
}

export default Dashboard;
