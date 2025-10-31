import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';

function Dashboard() {
  const navigate = useNavigate();
  // 1. Obtenemos el 'logout' y ahora también el 'user' desde el contexto
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="
        grid min-h-screen bg-[#12121e] text-white
        grid-rows-[60px_1fr_50px]
        md:grid-rows-[60px_1fr_50px]
        md:grid-cols-[200px_1fr]
        gap-0
      "
    >
      {/* HEADER */}
      <header
        className="
          bg-[#263e77] flex items-center justify-between px-4
          md:col-span-2 md:row-start-1 md:col-start-1
        "
      >
        {/* 2. Usamos el nombre de usuario (si existe) */}
        <h1 className="text-lg font-semibold">
          Bienvenido, {user?.username || 'Usuario'}
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 px-4 py-2 font-medium hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* NAV (Barra Lateral) */}
      <nav
        className="
          bg-gray-200 text-black p-4
          md:row-start-2 md:col-start-1
        "
      >
        {/* 3. Convertimos la lista en enlaces de navegación */}
        <ul className="space-y-2">
          <li>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="block px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Órdenes
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className="block px-3 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Usuarios
            </Link>
          </li>
        </ul>
      </nav>

      {/* MAIN (Contenido Principal) */}
      <main
        className="
          p-6
          md:row-start-2 md:col-start-2
        "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1e1e58] p-6 rounded-xl shadow">Card 1</div>
          <div className="bg-[#1e1e58] p-6 rounded-xl shadow">Card 2</div>
          <div className="bg-[#1e1e58] p-6 rounded-xl shadow">Card 3</div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="
          bg-[#263e77] flex items-center justify-center text-sm
          md:col-span-2 md:row-start-3 md:col-start-1
        "
      >
        Mi footer
      </footer>
    </div>
  );
}

export default Dashboard;