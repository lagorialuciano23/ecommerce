import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService';
import ProductCard from '../components/ProductCard';
import Toast from '../../shared/components/Toast';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

export default function CustomerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [canGoNext, setCanGoNext] = useState(true);

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  const [tempFilters, setTempFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsService.getActiveProducts(
          currentPage,
          pageSize,
          appliedFilters.search,
          appliedFilters.minPrice,
          appliedFilters.maxPrice
        );

        setProducts(response.Items);
        setCanGoNext(response.CurrentPage < response.TotalPages);
      } catch (err) {
        setError(err.message || 'Error desconocido');
        console.error('Error al cargar productos:', err);
        setToastOpen(true);
        setToastMessage('Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, appliedFilters]);

  const handleFilter = () => {
    setAppliedFilters({ ...tempFilters });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      search: '',
      minPrice: '',
      maxPrice: ''
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const handleAddToCart = (productName) => {
    setToastMessage(`"${productName}" agregado al carrito!`);
    setToastOpen(true);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const hasActiveFilters = appliedFilters.search || appliedFilters.minPrice || appliedFilters.maxPrice;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No se encontraron productos.</p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {products.map((product) => (
          <ProductCard
            key={product.Id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-gray-800 container mx-auto px-4 py-6">
      <Toast
        open={toastOpen}
        title="Notificación"
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />

      <h1 className="text-4xl font-bold text-gray-800 mb-6">Catálogo de productos </h1>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 mt-6">
        <div className="flex flex-col w-full md:flex-row gap-6 items-end">

          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Min
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={tempFilters.minPrice}
              onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Precio Max
            </label>
            <input
              type="number"
              min="0"
              placeholder="∞"
              value={tempFilters.maxPrice}
              onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleFilter}
              className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Filtrar
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                title="Limpiar filtros"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="w-full md:w-auto md:ml-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mostrar
            </label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            {appliedFilters.search && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Búsqueda: "{appliedFilters.search}"
              </span>
            )}
            {appliedFilters.minPrice && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Mín: ${Number(appliedFilters.minPrice).toLocaleString()}
              </span>
            )}
            {appliedFilters.maxPrice && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Máx: ${Number(appliedFilters.maxPrice).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mb-8">
        {renderContent()}
      </div>

      {!isLoading && products.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft />
          </button>
          <span className="text-gray-700 font-medium">
            Página {currentPage}
          </span>
          <button
            onClick={goToNextPage}
            disabled={!canGoNext}
            className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}