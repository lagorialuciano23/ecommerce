import { useState, useMemo, useEffect } from 'react';
import { CartContext } from './useCart';

// Función helper para leer del sessionStorage de forma segura
function getInitialCart() {
  try {
    const cart = sessionStorage.getItem('cart');

    return cart ? JSON.parse(cart) : [];
  } catch (e) {
    console.error('Error al parsear carrito desde localStorage', e);

    return [];
  }
}

export function CartProvider({ children }) {
  // 1. Estado que se inicializa con localStorage
  const [cartItems, setCartItems] = useState(getInitialCart);
  const [toastMessage, setToastMessage] = useState(null);

  // 2. Efecto que GUARDA en sessionStorage CADA VEZ que cartItems cambia
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones para modificar el carrito ---

  const clearToast = () => {
    setToastMessage(null);
  };

  /**
   * Añade un producto al carrito.
   * Si ya existe, incrementa la cantidad.
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const stockLimit = product.StockQuantity;
      const existingItem = prevItems.find(item => item.id === product.Id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (currentQuantityInCart >= stockLimit) {
        setToastMessage({
          title: 'Stock Límite',
          message: 'Ya tenés todo el stock disponible de este producto en tu carrito.',
        });

        return prevItems;
      }

      let newTotalQuantity = currentQuantityInCart + quantity;

      if (newTotalQuantity > stockLimit) {
        const quantityLeft = stockLimit - currentQuantityInCart;

        setToastMessage({
          title: 'Stock máximo alcanzado',
          message: `Solo se ${quantityLeft > 1 ? 'agregaron' : 'agregó'} ${quantityLeft} ${quantityLeft > 1 ? 'items' : 'item'} más.`,
        });
        newTotalQuantity = stockLimit;
      }

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.Id
            ? { ...item, quantity: newTotalQuantity }
            : item,
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.Id,
            name: product.Name,
            price: product.CurrentUnitPrice,
            quantity,
            stockLimit, // Guardamos el límite de stock
          },
        ];
      }
    });
  };

  /**
   * Actualiza la cantidad de un producto específico en el carrito.
   * Si la nueva cantidad es 0 o menor, elimina el producto.
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          // Si hay un límite de stock guardado, respetarlo
          if (item.stockLimit && newQuantity > item.stockLimit) {
            setToastMessage({
              title: 'Stock Límite',
              message: `Solo hay ${item.stockLimit} unidades disponibles.`,
            });
            return { ...item, quantity: item.stockLimit };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
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
    updateQuantity, // ← Nueva función
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    toastMessage,
    clearToast,
  }), [cartItems, cartTotal, cartCount, toastMessage]);

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}