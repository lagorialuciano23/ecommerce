import { createContext, useContext } from 'react';

// Exportar el Contexto
export const AuthContext = createContext(null);

// Exportar el hook de consumo aquí
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};
