function ProductsTable({products}) {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-3">
        {products && products.length > 0 ? (
          products.map((product) => (
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
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-base">
              No se encontraron productos asociados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsTable;