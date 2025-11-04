import { Link } from 'react-router-dom';

function ProductsTable({ products }) {
  return (
    <div className="container mx-auto p-4 text-white">

      {/* 2. Añadimos el botón "Crear Producto" que definimos antes */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="
            text-3xl font-bold text-gray-800
          "
        >
          Catalogo de Productos
        </h1>
        <Link
          to="/admin/products/create"
          className="rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition"
        >
          + Crear Producto
        </Link>
      </div>

      {/* --- VISTA MÓVIL CORREGIDA --- */}
      <div className="block lg:hidden space-y-3">
        {products.map((product) => (
          // 3. LA KEY AHORA ESTÁ EN EL DIV EXTERNO Y USA 'Id'
          <div key={product.Id} className="bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="
              bg-gray-800 p-4 rounded-xl shadow-lg
              text-white text-md
            ">
              <div className="flex justify-between mb-3">

                {/* 4. PROPIEDADES EN PascalCase */}
                <div className="flex-1" >
                  <h3>{product.Sku}</h3>
                  <p>{product.Name}</p>
                </div>

                <span className={`
                  flex items-center
                  px-2 py-1 rounded-full text-xs font-semibold ml-2
                  ${product.IsActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                `}>
                  {product.IsActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex justify-between text-sm pt-3">
                {/* 5. AÑADIDO .toFixed(2) CON PROTECCIÓN */}
                <span>Price: ${(product.CurrentUnitPrice || 0).toFixed(2)}</span>
                <span>Stock: {product.StockQuantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- VISTA ESCRITORIO CORREGIDA --- */}
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
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.length > 0 ? (
              products.map((product) => (

                // (La key aquí ya estaba bien)
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