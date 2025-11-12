import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService.js';
import { Link } from 'react-router-dom';
import AdminProductCard from '../components/AdminProductCard.jsx';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // 'searchTerm' se usará para la API (en el useEffect)
  const [searchTerm, setSearchTerm] = useState('');
  // 'localSearch' (NUEVO) se usará para el input
  const [localSearch, setLocalSearch] = useState('');
  //Añadimos el estado para el filtro
  const [filterStatus, setFilterStatus] = useState(''); // '' significa "Todos"
  //PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        //Pasamos el filtro al servicio
        const response = await productsService.getAll(currentPage, 8, searchTerm, filterStatus);

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
  }, [currentPage, searchTerm, filterStatus]);

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1)); // No ir por debajo de 1
  };

  // NUEVO HANDLER para el form de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reiniciamos a la página 1
    setSearchTerm(localSearch); // Actualizamos el término de búsqueda, lo que dispara el useEffect
  };

  //HANDLER para el <select>
  const handleStatusChange = (e) => {
    setCurrentPage(1);
    setFilterStatus(e.target.value);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Administrar Productos
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre, SKU..."
              className="flex-1 w-full p-2 border border-gray-300 rounded-lg"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-medium hover:bg-blue-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            Buscar
            </button>
          </form>
          {/* Filtro de Estado */}
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="p-2 border border-gray-300 rounded-lg h-full"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          <Link to="/admin/products/create">
            <button className="
            w-full md:w-auto h-full  /* Ajusta el tamaño */
            bg-green-500 hover:bg-green-600 text-white
            py-2 px-4 rounded-lg shadow font-medium transition"
            >
            Agregar Producto +
            </button>
          </Link>
        </div>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <AdminProductCard key={product.Id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-base">
            No se encontraron productos.
          </p>
        </div>
      )}
      {/* --- Paginación --- */}
      <div className="flex justify-between items-center mt-8">
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
    </div>
  );
}