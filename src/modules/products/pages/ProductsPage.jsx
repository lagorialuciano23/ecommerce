import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService.js';
import { Link } from 'react-router-dom';

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
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>

      <div className="overflow-x-auto bg-[#1e1e58] rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {/* Aquí ya no está el comentario que causaba el error.
              El tbody solo contiene la lógica de renderizado de los <tr>.
            */}
            {products.length > 0 ? (
              products.map((product) => (
                
                <tr key={product.Id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    {product.Sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.CurrentUnitPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.StockQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.IsActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                            Activo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100">
                        Inactivo
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                  No se encontraron productos. (Puedes agregar uno desde Swagger/Postman)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}