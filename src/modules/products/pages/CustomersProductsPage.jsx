import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsService } from '../services/productsService';
import ProductCard from '../components/ProductCard';

export default function CustomerProductsPage() {
  // Estados para los datos y la UI
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros y paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10); // Default 10

  const [searchParams] = useSearchParams(); //Hook para leer la URL

  const [canGoNext, setCanGoNext] = useState(true);

  //NUEVO EFECTO: Sincroniza la URL con el estado local
  // Este efecto se ejecuta CADA VEZ que la URL (searchParams) cambia.
  useEffect(() => {
    const querySearch = searchParams.get('search') || '';

    setSearchTerm(querySearch);
  }, [searchParams]);

  // Efecto para cargar los productos
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsService.getActiveProducts(
          currentPage,
          pageSize, // PageSize
          searchTerm,
        );

        // Ajustamos cómo guardamos los datos
        setProducts(response.Items); // <-- response.Items en lugar de response
        // Ajustamos la lógica del botón "Siguiente"
        setCanGoNext(response.CurrentPage < response.TotalPages);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, pageSize]);

  // --- Manejadores de Paginación ---
  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1)); // No ir por debajo de 1
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1); // Reiniciar a página 1
    setPageSize(Number(e.target.value));
  };

  // --- Renderizado ---

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-800">Cargando productos...</p>;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-900 bg-opacity-50 rounded-lg max-w-md mx-auto">
          <p className="text-lg text-red-300">Error al cargar productos:</p>
          <p className="text-white">{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return <p className="text-center text-gray-800">No se encontraron productos.</p>;
    }

    // Grilla de Productos
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {products.map((product) => (
          <ProductCard key={product.Id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="text-gray-800 container mx-auto">
      {/* Si el término de búsqueda existe, mostramos un título
        (Esto es opcional, pero mejora la experiencia)
      */}
      {searchTerm ? (
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Resultados para: "{searchTerm}"
        </h1>
      ) : (
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Catálogo</h1>
      )}

      <div className="mb-8">
        {renderContent()}
      </div>

      {/* --- Paginación --- */}
       <div className="grid grid-cols-1 sm:grid-cols-3 items-center mt-8 gap-4">

        {/* Dropdown de PageSize (Columna 1) */}
        <div className="flex items-center gap-2 justify-start">
          <label htmlFor="pageSize" className="text-sm text-gray-700">Mostrar:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="p-2 border border-gray-300 rounded-lg text-sm h-full"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Controles de Paginación (Columna 2) */}
        {/* Quitamos 'mt-8' que estaba mal copiado.
          'justify-center' centra los botones.
        */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400"
          >
            &larr; Anterior
          </button>
          <span className="text-gray-700">Página {currentPage}</span>
          <button
            onClick={goToNextPage}
            disabled={!canGoNext}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400"
          >
            Siguiente &rarr;
          </button>
        </div>

        {/* Columna 3 (vacía para centrar la Col 2) */}
        <div></div>
      </div>
    </div>
  );
}