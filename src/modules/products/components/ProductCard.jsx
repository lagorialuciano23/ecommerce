import { useState } from 'react';
import { useCart } from '../../cart/context/useCart';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1); // Inicia en 1 por defecto
  const { addToCart } = useCart(); // Hook del carrito

  const handleDecrease = () => {
    // No permite bajar de 1
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    // (Opcional: puedes limitar por product.stockQuantity)
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    // Verifica que la cantidad sea 1 o más
    if (quantity < 1) return;

    // Llama a la función del context
    addToCart(product, quantity);

    // Resetea la cantidad a 1 después de agregar
    setQuantity(1);
  };

  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-lg p-4 flex flex-col text-white border-rounded border-gray-500">
      {/* URL de imagen */}
      <div className="w-full h-48 bg-gray-700 rounded-md 
      flex items-center justify-center mb-4 overflow-hidden">
        {product.ImageUrl ? (
          // Si hay URL, mostramos la imagen
          <img
            src={product.ImageUrl}
            alt={product.Name}
            className="w-full h-full object-cover"
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

      {/* Nombre y Precio (usando camelCase) */}
      <h3 className=" text-gray-800 text-lg font-semibold">{product.Name}</h3>
      <p className="text-2xl font-bold text-green-400">
        ${(product.CurrentUnitPrice || 0).toFixed(2)}
      </p>

      {/* Controles de Cantidad */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={handleDecrease}
          className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-600"
        >
          -
        </button>
        <span className="border rounded-lg border-gray-300 text-lg text-gray-800 font-bold w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-600"
        >
          +
        </button>
      </div>

      {/* Botón Agregar */}
      <button
        onClick={handleAddToCart}
        disabled={quantity < 1} // Se deshabilita si la cantidad es 0 (aunque la UI ya no lo permite)
        className="w-full cursor-pointer bg-gray-800 text-white rounded-lg p-2
         transition-colors duration-200 hover:bg-gray-700
         disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Agregar
      </button>
    </div>
  );
}