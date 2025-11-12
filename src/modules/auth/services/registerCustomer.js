import { api } from '../../shared/services/api';

/**
 * Llama al endpoint de registro de Clientes (User).
 */
export async function registerCustomerService(username, email, password) {
  const requestBody = {
    Username: username,
    Email: email,
    Password: password,
  };

  // 'api.post' ahora devuelve el 'response.data' (el texto de éxito)
  return api.post('/auth/register-customer', requestBody);
}