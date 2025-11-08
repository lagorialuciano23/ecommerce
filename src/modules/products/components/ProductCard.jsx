import { useState } from 'react';
import { useCart } from '../../cart/context/useCart';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (quantity < 1) return;
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col border border-gray-200">
      {/* Imagen del producto - Más pequeña */}
      <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
        {product.ImageUrl ? (
          <img
            src={product.ImageUrl}
            alt={product.Name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        )}
      </div>

      {/* Nombre del producto - Más pequeño */}
      <h3 className="text-gray-900 text-sm font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
        {product.Name}
      </h3>

      {/* Precio - Más compacto */}
      <p className="text-lg font-bold text-green-600 mb-3">
        ${(product.CurrentUnitPrice || 0).toFixed(2)}
      </p>

      {/* Controles de Cantidad - Más pequeños */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <button
          onClick={handleDecrease}
          className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          -
        </button>
        <span className="text-gray-900 text-sm font-semibold w-8 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          +
        </button>
      </div>

      {/* Botón Agregar - Más pequeño */}
      <button
        onClick={handleAddToCart}
        disabled={quantity < 1}
        className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium
         transition-colors duration-200 hover:bg-gray-800
         disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Agregar
      </button>
    </div>
  );
}