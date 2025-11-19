import { useState, useMemo, useEffect } from 'react';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const savedToken = sessionStorage.getItem('token');

    return savedToken && savedToken !== 'null' ? savedToken : null;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('user');

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
    // Solo guardamos si hay un valor válido
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Limpiamos todo el sessionStorage al salir
    sessionStorage.clear();
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