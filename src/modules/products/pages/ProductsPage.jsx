import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService.js';
import { Link } from 'react-router-dom';
import ProductsTable from '../components/ProductsTable.jsx';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 4. Usamos nuestro servicio 'api' (que ya incluye el token)
        const response = await productsService.getAll();

        // Guardamos la respuesta
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
    <ProductsTable products={products} />
  );
}