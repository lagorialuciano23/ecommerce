import { useState, useEffect } from 'react';
import { ordersService } from '../services/orderServices';
import { Link } from 'react-router-dom';

// Definimos los estados de orden basados en tu backend
const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
  // Estados para los datos y la UI
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // (La API aún no devuelve el total de páginas, así que lo manejamos simple)
  // const [totalPages, setTotalPages] = useState(1);

  // Efecto para cargar las órdenes
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Llamamos al servicio con la paginación
        // (Añadiremos filterStatus y searchTerm cuando el backend los soporte)
        const response = await ordersService.getAll(
          currentPage,
          8, // PageSize (puedes ajustarlo)
          filterStatus,
          searchTerm);

        setOrders(response);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar órdenes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
    // Re-ejecutar este efecto si la página actual cambia
    // (Añadiremos filterStatus y searchTerm cuando el backend los soporte)
  }, [currentPage, filterStatus, searchTerm]);

  // --- Manejadores de eventos (aún no funcionales) ---
  const handleSearch = (e) => {
    e.preventDefault();
    // Al buscar, siempre volvemos a la página 1
    setCurrentPage(1);
    // El useEffect se encargará de re-llamar a la API
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    // Al cambiar el filtro, siempre volvemos a la página 1
    setCurrentPage(1);
    // El useEffect se encargará de re-llamar a la API
  };

  // --- Manejadores de Paginación ---
  const goToNextPage = () => {
    // (Idealmente, deshabilitar si estamos en la última página)
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1)); // No ir por debajo de 1
  };

  // --- Renderizado ---

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-white">Cargando órdenes...</p>;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-900 bg-opacity-50 rounded-lg max-w-md mx-auto">
          <p className="text-lg text-red-300">Error al cargar órdenes:</p>
          <p className="text-white">{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return <p className="text-center text-white">No se encontraron órdenes.</p>;
    }

    // LISTA DE ÓRDENES (basado en el diseño)
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.Id} className="bg-[#1e1e58] p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-white">Orden #{order.Id.substring(0, 8)}...</p>
              <p className="text-sm text-gray-400">Cliente ID: {order.CustomerId.substring(0, 8)}...</p>
              <p className="text-sm text-gray-300">Total: ${order.TotalAmount.toFixed(2)}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                order.Status === 'PENDING' ? 'bg-yellow-800 text-yellow-100' :
                  order.Status === 'DELIVERED' ? 'bg-green-800 text-green-100' :
                    order.Status === 'CANCELLED' ? 'bg-red-800 text-red-100' :
                      'bg-blue-800 text-blue-100'
              }`}>
                {order.Status}
              </span>
            </div>
            <Link
              to={`/admin/orders/${order.Id}`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Ver
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Órdenes</h1>

      {/* --- Filtros y Búsqueda (basado en el diseño) --- */}
      <div className="mb-6 p-4 bg-[#1e1e58] rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Buscar</label>
            <div className="flex">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID de cliente, N° de orden..."
                className="w-full p-2 rounded-l-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="p-2 rounded-r-lg bg-blue-600 hover:bg-blue-700 text-white">
                Buscar
              </button>
            </div>
          </form>

          {/* Filtro por Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Estado de Orden</label>
            <select
              id="status"
              value={filterStatus}
              onChange={handleStatusChange}
              className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- Contenido (Lista o Errores) --- */}
      {renderContent()}

      {/* --- Paginación --- */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-800 disabled:text-gray-500"
        >
          &larr; Anterior
        </button>
        <span className="text-white">Página {currentPage}</span>
        <button
          onClick={goToNextPage}
          // (Deshabilitar si no hay más páginas)
          // disabled={currentPage >= totalPages}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-800 disabled:text-gray-500"
        >
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}
