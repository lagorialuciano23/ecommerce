import { Link } from 'react-router-dom';

function ProductsTable({ products }) {
  return (
    <div className="container mx-auto p-4">
      {/* --- VISTA MOVIL --- */}
      <div className="space-y-3 lg:hidden">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.Id}
              className='bg-white p-4 rounded-lg shadow border border-gray-200 hover: shadow-md transition-shadow'
            >
              <div
                key={product.Sku}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-base mb-1">
                      {product.Sku} - {product.Name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <span>{product.StockQuantity} Stock</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.IsActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.IsActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>

                  <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors ml-4">
                  Ver
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-base">
              No se encontraron productos asociados.
            </p>
          </div>
        )}
      </div>

      {/* --- VISTA ESCRITORIO --- */}
      <div className="
        hidden lg:block
        overflow-x-auto bg-gray-800 rounded-xl shadow-lg
      ">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900 text-white text-md">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
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
                    {/* 5. AÑADIDO .toFixed(2) CON PROTECCIÓN */}
                    ${(product.CurrentUnitPrice || 0).toFixed(2)}
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
                  No se encontraron productos. ¡Crea el primero!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsTable;