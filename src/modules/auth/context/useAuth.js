import { createContext, useContext } from 'react';

// Exportar el Context aquí
export const AuthContext = createContext(null);

// Exportar el hook de consumo aquí
export function useAuth() {
  // Nota: Podrías añadir lógica para comprobar si está dentro de un AuthProvider
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};
