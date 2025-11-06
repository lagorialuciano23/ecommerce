import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/context/useCart';
import { useState } from 'react';

// Ícono simple de Carrito
function CartIcon() {
  const { cartCount } = useCart(); // Hook para obtener la cantidad

  return (
    <Link to="/cart" className="relative p-2 text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.121.001.24.015.356.042a4.858 4.858 0 014.145 4.724l-.86.513M3.375 4.5l.383 1.437m0 0L7.5 14.25M3.758 5.937l5.69 4.026a.75.75 0 01.27.527l-.637 7.158a.75.75 0 01-.676.688l-6.162.94a.75.75 0 01-.818-.675l-.637-7.158a.75.75 0 01.27-.527L3.758 5.937z"
        />
      </svg>
      {cartCount > 0 && (
        <span
          className="absolute top-0 right-0 flex h-5 w-5 items-center
          justify-center rounded-full bg-red-600 text-xs font-bold text-white"
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}

// Layout principal
export default function PublicLayout() {
  //Estado local para controlar el input de búsqueda
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/?search=${localSearch}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 shadow-md">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Título o Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            MiTienda
          </Link>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <input
              type="search"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white border-none
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* Ícono de Carrito */}
          <CartIcon />
        </nav>
      </header>

      {/* Contenido de la página */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}