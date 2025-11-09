import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { useCart } from '../../cart/context/useCart'; // No lo usamos
import { useAuth } from '../../auth/context/useAuth';
import { useState } from 'react';

// Layout principal
export default function PublicLayout() {
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  // 1. Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/?search=${localSearch}`);
    setIsMobileMenuOpen(false); // Cierra el menú al buscar
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false); // Cierra el menú
  };

  // Cierra el menú al hacer clic en cualquier link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        {/* --- Barra superior (Desktop y Mobile) --- */}
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">

          {/* Título o Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" onClick={handleLinkClick} className="text-xl font-bold text-gray-900">
              {/* Icono de Logo (de la imagen) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </Link>
            {/* Links de Desktop (ocultos en móvil) */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" onClick={handleLinkClick} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Productos
              </Link>
              <Link to="/cart" onClick={handleLinkClick} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Carrito de compras
              </Link>
            </div>
          </div>

          {/* Buscador de Desktop (oculto en móvil) */}
          <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
            <input
              type="search"
              placeholder="Buscar..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </span>
          </form>

          {/* Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition">
                Salir
              </button>
            ) : (
              <>
                <Link to="/login" onClick={handleLinkClick}>
                  <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/signup" onClick={handleLinkClick}>
                  <button className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition">
                    Registrarse
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* --- 2. Botón de Hamburguesa (Móvil) --- */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </nav>

        {/* --- 3. Panel Desplegable (Móvil) --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg p-4 space-y-4 border-t border-gray-200">
            {/* Buscador Móvil */}
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                placeholder="Buscar..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full p-2 pl-10 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </span>
            </form>

            {/* Links Móviles */}
            <Link to="/" onClick={handleLinkClick} className="block py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              Productos
            </Link>
            <Link to="/cart" onClick={handleLinkClick} className="block py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              Carrito de compras
            </Link>

            {/* Auth Móvil */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition">
                  Salir
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={handleLinkClick} className="block">
                    <button className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link to="/signup" onClick={handleLinkClick} className="block">
                    <button className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition">
                      Registrarse
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Contenido de la página */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}