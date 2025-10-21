import { useState, useMemo } from 'react';
//Importo el contexto
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  //Logica de autenticacion
  const authValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}