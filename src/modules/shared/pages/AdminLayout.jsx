import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../auth/context/useAuth';
import { LogOut, Menu, X, Shield, ShieldCheck } from 'lucide-react';

function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-white text-gray-800">
      {/* HEADER MEJORADO */}
      <header className="
        bg-white border-b border-gray-200
        sticky top-0 z-50 shadow-sm
      ">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Lado Izquierdo: Hamburger + Logo */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Menu - Solo mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Logo/Título con Escudo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="hidden md:block text-lg font-bold text-gray-800">
                Admin Panel
              </h1>
            </div>
          </div>

          {/* Centro: Info de Usuario (solo desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {user?.Username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-800 truncate">
                {user?.Username || 'Usuario'}
              </span>
              <span className="text-xs text-gray-500">Administrador</span>
            </div>
          </div>

          {/* Lado Derecho: Avatar Mobile + Logout */}
          <div className="flex items-center gap-2">

            {/* Avatar Mobile */}
            <div className="lg:hidden w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-xs">
                {user?.Username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>

            {/* Botón Logout */}
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2
                bg-gray-800 text-white
                px-3 md:px-4 py-2 rounded-lg font-medium text-sm
                hover:bg-gray-700 hover:shadow-md
                transition-all duration-200
                active:scale-95
              "
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR - Sin cambios */}
        <>
          {/* Overlay oscuro para mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Sidebar */}
          <nav
            className={`
              fixed top-[53px] left-0 h-[calc(100vh-53px)] w-64 
              bg-white shadow-lg z-40 
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 lg:static lg:h-full lg:w-56
            `}
          >
            <div className="p-4">
              <h2 className="text-gray-600 text-base font-semibold uppercase mb-3 px-3">
                Menu
              </h2>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/admin"
                    end
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Inicio
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/products"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Productos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/orders"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Ordenes
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </>

        <main className="flex-1 bg-gray-100 min-h-[calc(100vh-53px)] overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;