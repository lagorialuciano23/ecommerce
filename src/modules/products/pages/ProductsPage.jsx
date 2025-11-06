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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsService.getAll();

        setProducts(response);

      } catch (err) {
        setError(err.message);
        console.error('Error al cargar productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    return product.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

      <SearchInput  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <ProductsTable products={filteredProducts} />
  </div>
  );
}