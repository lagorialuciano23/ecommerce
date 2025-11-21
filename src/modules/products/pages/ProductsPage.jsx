import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService.js';
import { Link } from 'react-router-dom';
import AdminProductCard from '../components/AdminProductCard.jsx';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsService.getAll(currentPage, pageSize, searchTerm, filterStatus);
        setProducts(response.Items);
        setCanGoNext(response.CurrentPage < response.TotalPages);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, filterStatus, pageSize]);

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(localSearch);
  };

  const handleStatusChange = (e) => {
    setCurrentPage(1);
    setFilterStatus(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1);
    setPageSize(Number(e.target.value));
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm('');
    setLocalSearch('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || filterStatus;

  // Caso 1: Cargando
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-lg text-gray-700">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Caso 2: Error
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-red-700 mb-2">Error al cargar productos</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Caso 3: Éxito
  return (
    <div className='container mx-auto p-4'>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Administración de Productos
        </h1>

        <div className="flex flex-col gap-4">
          {/* Búsqueda */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre, SKU..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setLocalSearch('');
                }
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>

          {/* Filtro y Agregar */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={handleStatusChange}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            <Link to="/admin/products/create" className="flex-shrink-0">
              <button className="h-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition whitespace-nowrap">
                Agregar +
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Banner de filtros activos */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-blue-700 font-medium">Filtros activos:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  Búsqueda: "{searchTerm}"
                </span>
              )}
              {filterStatus && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  Estado: {filterStatus === 'active' ? 'Activos' : 'Inactivos'}
                </span>
              )}
            </div>
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Contador de resultados */}
      {products.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{products.length}</span> producto(s)
            {hasActiveFilters && ' (filtrado)'}
          </p>
        </div>
      )}

      {/* Lista de productos o mensaje vacío */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <AdminProductCard key={product.Id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600 text-lg font-medium mb-2">
            {hasActiveFilters ? 'No se encontraron productos' : 'No hay productos'}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {hasActiveFilters 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando tu primer producto'}
          </p>
          {hasActiveFilters ? (
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Limpiar filtros
            </button>
          ) : (
            <Link to="/admin/products/create">
              <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition">
                Agregar Producto +
              </button>
            </Link>
          )}
        </div>
      )}
     
      {/* Paginación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center mt-8 gap-4">
        <div className="flex items-center gap-2 justify-start">
          <label htmlFor="pageSize" className="text-sm text-gray-700">Mostrar:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="p-2 border border-gray-300 rounded-lg text-sm h-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>
          <span className="text-gray-700 font-medium">Página {currentPage}</span>
          <button
            onClick={goToNextPage}
            disabled={!canGoNext}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>

        <div></div>
      </div>
    </div>
  );
}