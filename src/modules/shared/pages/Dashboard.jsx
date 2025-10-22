import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="
        grid min-h-screen bg-[#12121e] text-white
        grid-rows-[60px_1fr_50px]          /* mobile: 3 filas */
        md:grid-rows-[60px_1fr_50px]       /* md+: idem filas */
        md:grid-cols-[200px_1fr]           /* md+: 2 columnas */
        gap-0
      "
    >
      {/* HEADER - va primero en el DOM */}
      <header
        className="
          bg-[#263e77] flex items-center justify-between px-4
          md:col-span-2 md:row-start-1 md:col-start-1
        "
      >
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 px-4 py-2 font-medium hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* NAV - ocupa la columna izquierda en md+ */}
      <nav
        className="
          bg-gray-200 text-black p-4
          md:row-start-2 md:col-start-1
        "
      >
        <ul className="space-y-2">
          <li>products</li>
          <li>orders</li>
          <li>users</li>
        </ul>
      </nav>

      {/* MAIN - ocupa la columna derecha en md+ */}
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

      {/* FOOTER - ocupa ambas columnas abajo */}
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
