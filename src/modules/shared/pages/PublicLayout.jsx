import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';
import { useState } from 'react';
import LoginModal from '../../cart/components/LoginModal';
import RegisterModal from '../../cart/components/RegisterModal';
import Toast from '../../shared/components/Toast';
import { useCart } from '../../cart/context/useCart';

// Layout principal
export default function PublicLayout() {
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  // 2. Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 3. Estado para controlar qué modal se ve
  const [modalView, setModalView] = useState(null); // 'login', 'register', o null
  const { toastMessage, clearToast, cartCount } = useCart();

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/?search=${localSearch}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Callback cuando el login de la modal es exitoso
  const handleLoginSuccess = () => {
    setModalView(null);
  };

  // Callback cuando el registro de la modal es exitoso
  const handleRegisterSuccess = () => {
    // Cerramos 'register' y abrimos 'login'
    setModalView('login');
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gray-100 text-gray-800 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 p-6 bg-white shadow-md border-b border-gray-200">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center gap-4">

          {/* IZQUIERDA: Logo + Links de navegación */}
          <div className="flex items-center gap-6">
            <Link to="/" onClick={handleLinkClick} className="text-xl font-bold text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </Link>
            {/* Links de Desktop (ocultos en móvil) */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" onClick={handleLinkClick} className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors">
                Productos
              </Link>
            </div>
          </div>

          {/* CENTRO: Buscador de Desktop (oculto en móvil) */}
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

          {/* DERECHA: Carrito + Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Carrito */}
            <Link
              to="/cart" onClick={handleLinkClick}
              className="relative group text-gray-900 hover:text-purple-600 transition-colors p-2"
              aria-label="Carrito de compras"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {/* Badge del carrito */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-sm border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divisor vertical */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-orders"
                  className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Mis Compras
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition">
                  Salir
                </button>
              </div>

            ) : (
              <>
                <button
                  onClick={() => setModalView('login')}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setModalView('register')}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Botón de Hamburguesa (Móvil) */}
          <div className="md:hidden flex items-center relative">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            {/* Badge en el menú hamburguesa */}
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            )}
          </div>
        </nav>

        {/* Panel Desplegable (Móvil) - CORREGIDO PARA USAR MODALES */}
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
            <Link to="/cart" onClick={handleLinkClick} className="flex items-center justify-between py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              <span>Carrito de compras</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Móvil */}
            {isLoggedIn ? (
              <div className='flex flex-col gap-2'>
                <Link
                  to="/my-orders"
                  className="text-md font-medium text-gray-600 hover:text-purple-600 transition-colors w-full"
                >
                  Mis Compras
                </Link>
                <button onClick={handleLogout} className="
                  px-4 py-2 rounded-lg bg-gray-200 
                  text-gray-800 text-md font-medium hover:bg-gray-300 transition">
                  Salir
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setModalView('login'); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => { setModalView('register'); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-gray-700 transition"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Contenido de la página */}
      <main className="flex-1 container mx-auto p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>

      <footer className="
          bg-purple-100 text-purple-800 p-4 text-center border-t border-purple-200
          ">
        © 2025 MiTienda. Todos los derechos reservados.
      </footer>
      {/* Renderizar las Modales (ocultas por defecto) */}
      <LoginModal
        open={modalView === 'login'}
        onClose={() => setModalView(null)}
        onLoginSuccess={handleLoginSuccess}
        footer={
          <div className="text-center text-sm text-gray-600 mt-4">
            ¿No tenés cuenta?{' '}
            <button
              type="button"
              onClick={() => setModalView('register')}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Registrate
            </button>
          </div>
        }
      />

      <RegisterModal
        open={modalView === 'register'}
        onClose={() => setModalView(null)}
        onRegisterSuccess={handleRegisterSuccess}
        footer={
          <div className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tenés cuenta?{' '}
            <button
              type="button"
              onClick={() => setModalView('login')}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Inicia Sesión
            </button>
          </div>
        }
      />
      <Toast
        open={!!toastMessage}
        title={toastMessage?.title || 'Aviso'}
        message={toastMessage?.message}
        onClose={clearToast}
        duration={3000} // Le damos 3 segundos
      />
    </div>
  );
}