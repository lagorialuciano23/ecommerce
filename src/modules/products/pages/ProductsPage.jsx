import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService.js';
import { Link } from 'react-router-dom';
import ProductsTable from '../components/ProductsTable.jsx';
import SearchInput from '../components/SearchInput.jsx';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  //PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 4. Usamos nuestro servicio 'api' (que ya incluye el token)
        const response = await productsService.getAll(currentPage, 8, searchTerm);

        // Guardamos la respuesta
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
  }, [currentPage, searchTerm]);

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1)); // No ir por debajo de 1
  };

  // Ya no filtramos en el frontend, el backend lo hace
  // const filteredProducts = products.filter((product) => {
  //   return product.Name.toLowerCase().includes(searchTerm.toLowerCase());
  // });

  // Caso 1: Cargando
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-white">Cargando productos...</p>
      </div>
    );
  }

  // Caso 2: Error (incluye "No hay productos cargados")
  if (error) {
    return (
      <div className="text-center p-8 bg-red-900 bg-opacity-50 rounded-lg max-w-md mx-auto">
        <p className="text-lg text-red-300">Error al cargar productos:</p>
        <p className="text-white">{error}</p>
      </div>
    );
  }

  // Caso 3: Éxito (mostrar tabla de productos)
  return (
    <div className = 'container mx-auto p-4'>

      <div className="
      flex flex-col lg:flex-row
      justify-between lg:items-center
      gap-4
      ">
        <h1 className="text-2xl font-bold mb-4 py-2 px-4 mb-4 lg:mb-0">
          Admin Products
        </h1>
        <Link to="/admin/products/create">
          <button className="
          bg-green-500 hover:bg-green-200 text-green-900
          py-2 px-4 rounded"
          >
          Add Product+
          </button>
        </Link>
      </div>
      {/* Usar setSearchTerm (el useEffect se encargará del resto) */}
      <SearchInput  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {/* Pasamos 'products' (ya filtrados por backend) */}
      <ProductsTable products={products} />
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