import { useState } from 'react';
import { useCart } from '../../cart/context/useCart';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1); // Inicia en 1 por defecto
  const { addToCart } = useCart(); // Hook del carrito

  const handleDecrease = () => {
    // No permite bajar de 1
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    // Usamos el StockQuantity (con PascalCase) como límite
    const stockLimit = product.StockQuantity;

    // Solo aumentamos si la cantidad actual es MENOR al stock
    setQuantity((prev) => Math.min(stockLimit, prev + 1));
  };

  const handleAddToCart = () => {
    // Verifica que la cantidad sea 1 o más
    if (quantity < 1) return;

    // Llama a la función del context
    addToCart(product, quantity);

    if (onAddToCart) {
      onAddToCart(product.Name);
    }
    // Resetea la cantidad a 1 después de agregar
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col text-gray-900 h-full">

      {/* 1. Imagen Clickeable */}
      <Link to={`/products/${product.Id}`}>
        <div className="w-full h-48 bg-gray-700 rounded-md flex items-center justify-center mb-4 overflow-hidden group">
          {product.ImageUrl ? (
            // Si hay URL, mostramos la imagen
            <img
              src={product.ImageUrl}
              alt={product.Name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              // Opcional: manejar errores de imagen
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            // Si NO hay URL, mostramos el ícono placeholder
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 7.61c0-1.88 2-3.61 4-3.61s4 1.73 4 3.61v3.78c0 1.88-2 3.61-4 3.61s-4-1.73-4-3.61V7.61zM16 12.61c0 1.88 2 3.61 4 3.61s4-1.73 4-3.61V8.83c0-1.88-2-3.61-4-3.61s-4 1.73-4 3.61v3.78zM7 16.61c0 1.88-2 3.61-4 3.61s-4-1.73-4-3.61v-3.78c0-1.88 2-3.61 4-3.61s4 1.73 4 3.61v3.78zM17 20.39c0 1.88 2 3.61 4 3.61s4-1.73 4-3.61v-3.78c0-1.88-2-3.61-4-3.61s-4 1.73-4 3.61v3.78z" />
            </svg>
          )}
        </div>
      </Link>

      {/* 2. Título Clickeable */}
      <Link to={`/products/${product.Id}`}>
        <h3 className="text-lg font-semibold hover:text-blue-400 transition-colors">{product.Name}</h3>
      </Link>

      {/* 3. Descripción */}
      <p className="text-sm text-gray-400 mt-1 mb-2 line-clamp-2" title={product.Description}>
        {product.Description}
      </p>

      {/* 3. Stock */}
      <p className="text-sm text-gray-400 mt-1 mb-2 line-clamp-2" title={product.StockQuantity}>
        Stock: {product.StockQuantity}
      </p>

      {/* 4. Precio */}
      <p className="text-2xl font-bold text-gray-900 mt-2">
        ${(product.CurrentUnitPrice || 0).toFixed(2)}
      </p>

      {/* Controles de Cantidad - mt-auto los empuja al final */}
      <div className="flex items-center justify-center gap-2 mb-4 mt-auto pt-4">
        <button
          onClick={handleDecrease}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg font-bold w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Botón Agregar */}
      <button
        onClick={handleAddToCart}
        disabled={quantity < 1 || product.StockQuantity === 0} // Deshabilitado si no hay stock
        className="cursor-pointer bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium
           transition-colors duration-200 hover:bg-purple-700
           disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {product.StockQuantity === 0 ? 'Sin Stock' : 'Agregar'}
      </button>
    </div>
  );
}