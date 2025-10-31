import { useState, useMemo, useEffect } from 'react';
//Importo el contexto
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  //Estado para el token y el usuario
  //Intentamos leerlo desde loal storage al cargar la aplicacion
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() =>{
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (event) {
      console.error('Error al obtener el usuario del localStorage:', event);

      return null;
    }
  });

  //'isLoggedIn' ahora es un valor derivado:
  // El usuario ESTÁ logueado si existe un token.

  const isLoggedIn = !!token;

  //Usamos useEffect para sincronizar el estado con localStorage
  useEffect(() => {
    // Lógica del Token (Independiente)
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    // Lógica del Usuario (Independiente)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]); // Se ejecuta cuando token o user cambian

  //Modificamos las funciones de login y logout
  const login = (userData, userToken) => {
    // Esta función será llamada por Login.jsx con los datos del backend
    setUser(userData);
    setToken(userToken);
    // El useEffect de arriba se encargará de guardar en localStorage
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    // El useEffect de arriba se encargará de limpiar localStorage
  };
  //Exponemos los nuevos valores en el contexto
  const authValue = useMemo(() => ({
    isLoggedIn,
    token,
    user,
    login,
    logout,
  }), [isLoggedIn, token, user]); // Actualizamos las dependencias del 'useMemo'

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}