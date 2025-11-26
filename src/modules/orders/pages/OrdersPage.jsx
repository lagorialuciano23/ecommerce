import { useState, useEffect } from 'react';
import { ordersService } from '../services/orderServices';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusTranslations = {
  'PENDING': 'Pendiente',
  'PROCESSING': 'En Proceso',
  'SHIPPED': 'Enviado',
  'DELIVERED': 'Entregado',
  'CANCELLED': 'Cancelado',
};

const getStatusClasses = (status) => {
  const statusMap = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'PROCESSING': 'bg-blue-100 text-blue-700',
    'SHIPPED': 'bg-indigo-100 text-indigo-700',
    'DELIVERED': 'bg-green-100 text-green-700',
    'CANCELLED': 'bg-red-100 text-red-700',
  };

  return statusMap[status] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status) => {
  const iconProps = { className: 'w-5 h-5' };

  switch (status) {
    case 'PENDING': return <Clock {...iconProps} className="w-5 h-5 text-yellow-600" />;
    case 'PROCESSING': return <Package {...iconProps} className="w-5 h-5 text-blue-600" />;
    case 'SHIPPED': return <Truck {...iconProps} className="w-5 h-5 text-indigo-600" />;
    case 'DELIVERED': return <CheckCircle {...iconProps} className="w-5 h-5 text-green-600" />;
    case 'CANCELLED': return <XCircle {...iconProps} className="w-5 h-5 text-red-600" />;
    default: return null;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [canGoNext, setCanGoNext] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ordersService.getAll(
          currentPage,
          pageSize,
          filterStatus,
          searchTerm,
        );

        setOrders(response);
        setCanGoNext(response.length === pageSize);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar órdenes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, filterStatus, searchTerm, pageSize]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1);
    setPageSize(Number(e.target.value));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando órdenes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-10 h-10 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base font-semibold text-red-700 mb-1">Error al cargar órdenes</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600">No se encontraron órdenes</p>
          <p className="text-gray-500 text-sm mt-1">Intenta ajustar los filtros</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.Id}
            className={`bg-white mb-4 p-4 rounded-lg shadow-sm border-l-4 
                       hover:shadow-md hover:scale-[1.02] transition-all duration-200 ${
              order.Status === 'PENDING' ? 'border-l-yellow-500' :
              order.Status === 'PROCESSING' ? 'border-l-blue-500' :
              order.Status === 'SHIPPED' ? 'border-l-indigo-500' :
              order.Status === 'DELIVERED' ? 'border-l-green-500' :
              'border-l-red-500'
            }`}
          >
            {/* Header con nombre y badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                  {order.CustomerName || 'Cliente Desconocido'}
                </h3>
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-500">
                    ID Cliente: <span className="font-mono text-gray-700">{order.CustomerId.substring(0, 13)}...</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    ID Orden: <span className="font-mono text-gray-700">{order.Id.substring(0, 13)}...</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                {getStatusIcon(order.Status)}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusClasses(order.Status)}`}>
                  {statusTranslations[order.Status] || order.Status}
                </span>
              </div>
            </div>

            {/* Fecha y Total */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Fecha de orden</p>
                <p className="text-sm font-medium text-gray-800">
                  {order.Date ? new Date(order.Date).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  ${order.TotalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Botón de acción */}
            <Link
              to={`/admin/orders/${order.Id}`}
              className="block w-full text-center bg-purple-50 text-purple-700 px-4 py-2.5 rounded-md text-sm font-medium 
                         hover:bg-purple-100 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            >
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      
      {/* Filtros y Búsqueda */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4"> 
          Administración de Órdenes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Búsqueda */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1.5">
              Buscar
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, ID de cliente, N° orden..."
                className="flex-1 p-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
              Estado de Orden
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={handleStatusChange}
              className="w-full p-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{statusTranslations[status]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {renderContent()}

      {/* Paginación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center mt-6 gap-4">
        {/* Dropdown de PageSize */}
        <div className="flex items-center gap-2 justify-start">
          <label htmlFor="pageSize" className="text-sm text-gray-700">Mostrar:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Controles de Paginación */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-700">Página {currentPage}</span>
          <button
            onClick={goToNextPage}
            disabled={!canGoNext}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Espacio vacío para centrar */}
        <div></div>
      </div>
    </div>
  );
}