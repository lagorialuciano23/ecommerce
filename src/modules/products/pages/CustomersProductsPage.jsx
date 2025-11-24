import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsService } from '../services/productsService';
import ProductCard from '../components/ProductCard';
import Toast from '../../shared/components/Toast';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

export default function CustomerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [canGoNext, setCanGoNext] = useState(true);

  // Estados de filtros APLICADOS (los que se envían al backend)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  // Estados temporales para los inputs (lo que el usuario escribe)
  const [tempFilters, setTempFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  const [searchParams, setSearchParams] = useSearchParams(); 
  
  // Toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Sincronizar URL con Estado (solo al montar o cambiar URL externamente)
  useEffect(() => {
    const querySearch = searchParams.get('search') || '';
    const queryMin = searchParams.get('minPrice') || '';
    const queryMax = searchParams.get('maxPrice') || '';
    const queryPage = parseInt(searchParams.get('page')) || 1;

    setAppliedFilters({
      search: querySearch,
      minPrice: queryMin,
      maxPrice: queryMax
    });

    setTempFilters({
      search: querySearch,
      minPrice: queryMin,
      maxPrice: queryMax
    });

    setCurrentPage(queryPage);
  }, [searchParams]);

  // 2. Fetch de Productos
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

  // 3. Manejar la acción de Filtrar
  const handleFilter = () => {
    const params = {};
    
    if (tempFilters.search) params.search = tempFilters.search;
    if (tempFilters.minPrice) params.minPrice = tempFilters.minPrice;
    if (tempFilters.maxPrice) params.maxPrice = tempFilters.maxPrice;
    
    // Al filtrar, volvemos a la página 1
    params.page = 1;
    
    setSearchParams(params);
  };

  // 4. Limpiar filtros
  const handleClearFilters = () => {
    setTempFilters({
      search: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchParams({ page: 1 });
  };

  // 5. Detectar Enter en inputs
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  // Manejadores de eventos
  const handleAddToCart = (productName) => {
    setToastMessage(`"${productName}" agregado al carrito!`);
    setToastOpen(true);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    
    // Mantener filtros actuales pero resetear a página 1
    const params = {};
    if (appliedFilters.search) params.search = appliedFilters.search;
    if (appliedFilters.minPrice) params.minPrice = appliedFilters.minPrice;
    if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;
    params.page = 1;
    
    setSearchParams(params);
  };

  const goToNextPage = () => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: currentPage + 1 });
  };

  const goToPrevPage = () => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: Math.max(1, currentPage - 1) });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = appliedFilters.search || appliedFilters.minPrice || appliedFilters.maxPrice;

  // Renderizado del contenido
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

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Catálogo</h1>

      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col w-full md:flex-row gap-6 items-end">
          
          {/* Precio Mínimo */}
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Mín
            </label>
            <input 
              type="number" 
              min="0"
              placeholder="0"
              value={tempFilters.minPrice}
              onChange={(e) => setTempFilters({...tempFilters, minPrice: e.target.value})}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          {/* Precio Máximo */}
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Precio Máx
            </label>
            <input 
              type="number" 
              min="0"
              placeholder="∞"
              value={tempFilters.maxPrice}
              onChange={(e) => setTempFilters({...tempFilters, maxPrice: e.target.value})}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 w-full md:w-auto">
            {/* Botón Aplicar Filtros */}
            <button 
              onClick={handleFilter}
              className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Filtrar
            </button>

            {/* Botón Limpiar (solo si hay filtros) */}
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
          
          {/* Selector Page Size */}
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

        {/* Indicador de filtros activos */}
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

      {/* Contenido */}
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Paginación */}
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