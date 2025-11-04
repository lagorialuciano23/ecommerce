function ProductsTable({products}) {
    return (
   <div>
      <div className="container mx-auto p-4 text-white">
       <div className="block lg:hidden space-y-3">
        {products.map((product) => (
          <div key={product.Sku} className="
            bg-purple-100 p-4 rounded-xl shadow-lg
            text-purple-900 text-md
          ">
            <div className="flex justify-between mb-3">

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
              <span>Price: ${product.CurrentUnitPrice}</span>
              <span>Stock: {product.StockQuantity}</span>
            </div>
          </div>
        ))}

      </div>

      <div className="
      hidden lg:block 
      overflow-x-auto bg-purple-100 rounded-xl shadow-lg
      "
      >
        <table className="min-w-full divide-y divide-purple-100">
          <thead className="bg-purple-100 text-purple-900 text-md">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-900 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-900 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-900 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-900 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-purple-900 uppercase tracking-wider">
               Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {/* Aquí ya no está el comentario que causaba el error.
              El tbody solo contiene la lógica de renderizado de los <tr>.
            */}
            {products.length > 0 ? (
              products.map((product) => (
                
                <tr key={product.Id} className="hover:bg-purple-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                    {product.Sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900">
                    {product.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900">
                    ${product.CurrentUnitPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900">
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
                  No se encontraron productos asociados. 
                </td>
              </tr>
            )}
          </tbody>
          </table>
       </div>
      </div>
  </div>
  );
}

export default ProductsTable;
