import { createContext, useContext } from 'react';

// 1. Creamos el contexto
export const CartContext = createContext(null);

// 2. Creamos el hook para consumirlo
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  return context;
};