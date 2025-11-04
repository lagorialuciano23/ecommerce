import { useState, useMemo, useEffect } from 'react';
import { CartContext } from './useCart';

// Función helper para leer del localStorage de forma segura
function getInitialCart() {
  try {
    const cart = localStorage.getItem('cart');

    return cart ? JSON.parse(cart) : [];
  } catch (e) {
    console.error('Error al parsear carrito desde localStorage', e);

    return [];
  }
}

export function CartProvider({ children }) {
  // 1. Estado que se inicializa con localStorage
  const [cartItems, setCartItems] = useState(getInitialCart);

  // 2. Efecto que GUARDA en localStorage CADA VEZ que cartItems cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones para modificar el carrito ---

  /**
   * Añade un producto al carrito.
   * Si ya existe, incrementa la cantidad.
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.Id); // Usamos Id (mayúscula)

      if (existingItem) {
        // Si existe, actualiza la cantidad
        return prevItems.map(item =>
          item.id === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        // Si no existe, lo añade
        return [
          ...prevItems,
          {
            id: product.Id,
            name: product.Name,
            price: product.CurrentUnitPrice,
            quantity,
          },
        ];
      }
    });
  };

  /**
   * Elimina un producto del carrito por su ID.
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  /**
   * Vacía completamente el carrito.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // --- Cálculos derivados ---
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // 3. Exponemos todo en el contexto
  const cartValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  }), [cartItems, cartTotal, cartCount]);

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}