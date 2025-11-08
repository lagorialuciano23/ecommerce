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
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
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
    <div className="min-h-screen flex flex-col bg-gray-200 text-gray-800" >
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