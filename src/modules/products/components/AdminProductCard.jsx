import { Link } from 'react-router-dom';

// Recibe un solo 'product' como prop
export default function AdminProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Contenido principal */}
      <div>
        {/* Imagen */}
        <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center mb-4 overflow-hidden">
          {product.ImageUrl ? (
            <img
              src={product.ImageUrl}
              alt={product.Name}
              className="w-full h-full object-cover"
            />
          ) : (
            // Placeholder si no hay imagen
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 7.61c0-1.88 2-3.61 4-3.61s4 1.73 4 3.61v3.78c0 1.88-2 3.61-4 3.61s-4-1.73-4-3.61V7.61zM16 12.61c0 1.88 2 3.61 4 3.61s4-1.73 4-3.61V8.83c0-1.88-2-3.61-4-3.61s-4 1.73-4 3.61v3.78zM7 16.61c0 1.88-2 3.61-4 3.61s-4-1.73-4-3.61v-3.78c0-1.88 2-3.61 4-3.61s4 1.73 4 3.61v3.78zM17 20.39c0 1.88 2 3.61 4 3.61s4-1.73 4-3.61v-3.78c0-1.88-2-3.61-4-3.61s-4 1.73-4 3.61v3.78z" />
            </svg>
          )}
        </div>

        {/* SKU */}
        <p className="text-xs text-gray-500">{product.Sku}</p>

        {/* Nombre */}
        <h3 className="text-gray-900 font-semibold text-base mb-1 truncate" title={product.Name}>
          {product.Name}
        </h3>

        {/* --- DESCRIPCIÓN AÑADIDA --- */}
        <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={product.Description}>
          {product.Description}
        </p>

        {/* Precio y Stock */}
        <div className="flex justify-between items-center text-sm mb-3">
          <p className="text-gray-700 font-bold">
            ${(product.CurrentUnitPrice || 0).toFixed(2)}
          </p>
          <p className="text-gray-500">{product.StockQuantity} en Stock</p>
        </div>
      </div>

      {/* Contenido inferior (Estado y Botones) */}
      <div className="flex justify-between items-center mt-2">
        {/* Estado */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          product.IsActive
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {product.IsActive ? 'Activo' : 'Inactivo'}
        </span>

        {/* Botones */}
        <div className="flex gap-2">
          {/* Botón "Ver" (público) */}
          <Link
            to={`/products/${product.Id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            Ver
          </Link>

          {/* Botón "Editar" (admin) */}
          <Link
            to={`/admin/products/edit/${product.Id}`}
            className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}