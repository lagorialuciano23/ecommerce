import { useState, useMemo } from 'react';
//Importo el contexto
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  // 1. Definimos un estado booleano simple para la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /// 2. Definimos las funciones de acción de autenticación
  const login = () => {
    // Implementación del login (marcar como logueado)
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Implementación del logout (marcar como deslogueado)
    setIsLoggedIn(false);
  };

  // 3. Empaquetamos todo en un objeto memoizado para el contexto
  //Ahora exponemos isLoggedIn, login y logout
  const authValue = useMemo(() => ({
    isLoggedIn,
    login,
    logout,
  }), [isLoggedIn]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}