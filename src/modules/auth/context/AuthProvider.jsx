import { useState, useMemo, useEffect } from 'react';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  // ✅ CORRECCIÓN: Validamos que el token sea válido
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    // Solo retornamos el token si existe y NO es la cadena "null"
    return savedToken && savedToken !== 'null' ? savedToken : null;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      // Validamos que no sea null, undefined o la cadena "null"
      if (!savedUser || savedUser === 'null') {
        return null;
      }
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error al obtener el usuario del localStorage:', error);
      return null;
    }
  });

  // El usuario ESTÁ logueado si existe un token válido
  const isLoggedIn = !!token;

  // Sincronizamos el estado con localStorage
  useEffect(() => {
    // ✅ CORRECCIÓN: Solo guardamos si hay un valor válido
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Los removeItem del useEffect limpiarán localStorage
  };

  const authValue = useMemo(() => ({
    isLoggedIn,
    token,
    user,
    login,
    logout,
  }), [isLoggedIn, token, user]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}