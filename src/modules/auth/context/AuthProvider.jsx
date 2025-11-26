import { useState, useMemo, useEffect, useCallback } from 'react';
import { AuthContext } from './useAuth';

// Helper simple para decodificar JWT sin librerías externas (opcional)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  // 1. Estado de carga inicial
  const [isLoading, setIsLoading] = useState(true);

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');

      return savedUser ? JSON.parse(savedUser) : null;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return null;
    }
  });

  // Función de Logout memorizada
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // --- EFECTO PARA SINCRONIZAR PESTAÑAS ---
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Si la clave 'token' cambia a null (alguien hizo logout en otra pestaña)
      if (event.key === 'token' && event.newValue === null) {
        console.log('Sesión cerrada en otra pestaña. Cerrando sesión aquí...');
        logout(); // Cerramos sesión en esta pestaña también
      }
    };

    // Escuchamos el evento
    window.addEventListener('storage', handleStorageChange);

    // Limpiamos el evento al desmontar
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  // Efecto de Inicialización y Verificación de Token
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        // Verificar expiración del token
        const decoded = parseJwt(storedToken);
        const currentTime = Date.now() / 1000;

        if (decoded && decoded.exp < currentTime) {
          console.warn('Token expirado, cerrando sesión...');
          logout();
        } else {
          // Todo ok, aseguramos que el estado esté sincronizado
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  }, []);

  // Helpers de Roles (Derivados del estado)
  // Verificamos si user y user.roles existen, y normalizamos a minúsculas para evitar errores de "Admin" vs "admin"
  const hasRole = useCallback((roleName) => {
    return user?.roles?.some(r => r.toLowerCase() === roleName.toLowerCase()) ?? false;
  }, [user]);

  const isAdmin = useMemo(() => hasRole('Admin'), [hasRole]);

  // 5. Valor del Contexto
  const authValue = useMemo(() => ({
    isLoggedIn: !!token,
    token,
    user,
    login,
    logout,
    isLoading, // Exponemos isLoading
    hasRole,   // Exponemos función genérica
    isAdmin,    // Exponemos booleano directo
  }), [token, user, login, logout, isLoading, hasRole, isAdmin]);

  return (
    <AuthContext.Provider value={authValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}