import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { useCart } from '../../cart/context/useCart'; // <-- 1. Quitamos esto
import { useAuth } from '../../auth/context/useAuth';
import { useState } from 'react';

// Layout principal
export default function PublicLayout() {
  //Estado local para controlar el input de búsqueda
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Obtenemos el estado de login

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/?search=${localSearch}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Refresca la página al inicio
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Título o Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-gray-900">
              {/* Icono de Logo (de la imagen) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>

            </Link>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Productos
            </Link>
            <Link to="/cart" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Carrito de compras
            </Link>
          </div>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <input
              type="search"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full p-2 rounded-lg border-gray-200 bg-gray-200 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* --- INICIO DE LA CORRECCIÓN --- */}
          {/* Botones de Autenticación */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              // Si está logueado, muestra botón de Salir
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition"
              >
                Salir
              </button>
            ) : (
              // Si no, muestra Login y Registro
              <>
                <Link to="/login">
                  <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>
          {/* --- FIN DE LA CORRECCIÓN --- */}
        </nav>
      </header>

      {/* Contenido de la página */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}