import { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useCart } from '../../cart/context/useCart';
import { Plus, Minus } from 'lucide-react';


export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  // animacion para la tarjeta
  const cardSpring = useSpring({
    transform: isHovered
      ? 'translateY(-12px) scale(1.01)'
      : 'translateY(0px) scale(1)',
    boxShadow: isHovered
      ? '0 20px 40px rgba(0, 0, 0, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.08)',
    config: config.gentle,
  });

  // animacion para la img
  const imageSpring = useSpring({
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    config: config.gentle,
  });

  // animacion para el precio
  const priceSpring = useSpring({
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    color: isHovered ? '#9333ea' : '#111827',
    config: config.gentle,
  });

  // animacion para el boton
  const buttonSpring = useSpring({
    transform: isHovered ? 'translateY(0px)' : 'translateY(4px)',
    opacity: isHovered ? 1 : 0.95,
    config: config.gentle,
  });

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    const stockLimit = product.StockQuantity;
    setQuantity((prev) => Math.min(stockLimit, prev + 1));
  };

  const handleAddToCart = () => {
    if (quantity < 1) return;
    addToCart(product, quantity);
    if (onAddToCart) {
      onAddToCart(product.Name);
    }
  };

  // determinar color del badge de stock
  const getStockBadgeColor = () => {
    if (product.StockQuantity === 0) return 'bg-red-100 text-red-700';
    if (product.StockQuantity <= 20) return 'bg-yellow-100 text-yellow-700';
    if (product.StockQuantity <= 100) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <animated.div
      style={cardSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col text-gray-900 h-full relative"
    >
      {/* stock badge*/}
      <div className="absolute top-2 right-2 z-10">
        <span className={`${getStockBadgeColor()} px-3 py-1 rounded-full text-xs font-semibold`}>
          Stock: {product.StockQuantity}
        </span>
      </div>

      {/* animacion para la img */}
      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4 overflow-hidden">
        {product.ImageUrl ? (
          <animated.img
            style={imageSpring}
            src={product.ImageUrl}
            alt={product.Name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <svg
            className="w-12 h-12 text-gray-400"
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

      {/* Titulo */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 min-h-[3.5rem] line-clamp-2">
        {product.Name}
      </h3>

      {/* Descrip */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2" title={product.Description}>
        {product.Description.substring(0, 20)}...
      </p>

      {/* preio con animacion */}
      <animated.p style={priceSpring} className="text-2xl font-bold mb-4">
        ${(product.CurrentUnitPrice || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </animated.p>

      {/* controles para umentar*/}
      <div className="flex items-center justify-center gap-3 mb-4 mt-auto">
        <button
          onClick={handleDecrease}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center font-semibold text-lg"
        >
          <Minus size={20} />
        </button>
        <span className="text-lg font-bold w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center font-semibold text-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* animacion con spring*/}
      <animated.button
        style={buttonSpring}
        onClick={handleAddToCart}
        disabled={quantity < 1 || product.StockQuantity === 0}
        className="bg-purple-600 text-white rounded-lg px-4 py-3 text-sm font-semibold
           transition-colors duration-200 hover:bg-purple-700
           disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {product.StockQuantity === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
      </animated.button>
    </animated.div>
  );
}