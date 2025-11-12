import { api } from '../../shared/services/api';

/**
 * Llama al endpoint de login del backend.
 */
export function loginService(username, password) {
  const requestBody = {
    Username: username,
    Password: password,
  };

  // Axios se encarga de:
  // - Poner el baseURL la ruta es /auth/login
  // - Convertir a JSON
  // - Manejar el error
  return api.post('/auth/login', requestBody);
}