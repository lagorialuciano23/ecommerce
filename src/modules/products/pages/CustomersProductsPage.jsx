import { useState, useEffect } from 'react';
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
  // (La API de C# aún no devuelve el total de páginas,
  //  así que asumimos que 'siguiente' está habilitado si recibimos 8 productos)
  const [canGoNext, setCanGoNext] = useState(true);

  // Efecto para cargar los productos
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productsService.getAll(
          currentPage,
          8, // PageSize
          searchTerm,
        );

        setProducts(response);
        // Si la API devuelve menos de 8 productos, ya no hay página siguiente
        setCanGoNext(response.length === 8);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm]);

  // --- Manejadores de Paginación ---
  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1)); // No ir por debajo de 1
  };

  // --- Renderizado ---

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-white">Cargando productos...</p>;
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
      return <p className="text-center text-white">No se encontraron productos.</p>;
    }

    // Grilla de Productos
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          // Usamos camelCase para el 'id'
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Card Grid</h1>

      {/* --- Contenido (Grilla o Errores) --- */}
      {renderContent()}

      {/* --- Paginación --- */}
      <div className="flex justify-between items-center mt-8">
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
          disabled={!canGoNext} // Deshabilitado si no hay más páginas
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-800 disabled:text-gray-500"
        >
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}