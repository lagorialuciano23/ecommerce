import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../auth/context/useAuth';

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
      {/* HEADER - Mobile First */}
      <header className="
        bg-white border-b border-gray-200 px-4 py-3
        flex items-center justify-between
        sticky top-0 z-50 shadow-md
      ">
        {/* Hamburger Menu - Solo visible en mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <h1 className="text-base md:text-lg font-semibold text-gray-800">
          Iniciado sesión como{' '}
          {user && user.Username ? user.Username : 'User'}
        </h1>

        <button
          onClick={handleLogout}
          className="
            text-xs md:text-sm bg-gray-800 text-white
            px-3 py-1.5 md:px-4 md:py-2 rounded-md font-medium
            hover:bg-gray-700 transition
          "
        >
          Salir
        </button>
      </header>

      <div className="flex">
        {/* SIDEBAR - Mobile First con overlay */}
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
              <h2 className="text-gray-600 text-xs font-semibold uppercase mb-3 px-3">
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