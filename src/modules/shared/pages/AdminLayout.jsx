import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';

function AdminLayout() {
  const navigate = useNavigate();
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

      {/* NAV (Barra Lateral) - CORREGIDO */}
      <nav
        className="
          bg-gray-200 text-black p-4
          md:row-start-2 md:col-start-1
        "
      >
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin" // Esta ruta es absoluta al "index" del admin
              end // 'end' es para que no se marque activo en /admin/products
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-gray-400' : 'hover:bg-gray-300'}`
              }
            >
              Principal
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products" // Ruta absoluta completa
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-gray-400' : 'hover:bg-gray-300'}`
              }
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders" // Ruta absoluta completa
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-gray-400' : 'hover:bg-gray-300'}`
              }
            >
              Órdenes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users" // Ruta absoluta completa
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-gray-400' : 'hover:bg-gray-300'}`
              }
            >
              Usuarios
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* MAIN (Contenido Principal) - CORREGIDO */}
      <main
        className="
          p-6
          md:row-start-2 md:col-start-2
          overflow-y-auto {/* Le añadí overflow por si el contenido es largo */}
        "
      >
        {/* ¡YA NO ESTÁN LAS CARDS! Solo el Outlet */}
        <Outlet />
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

export default AdminLayout;