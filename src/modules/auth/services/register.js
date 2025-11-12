import { api } from '../../shared/services/api';

/**
 * Llama al endpoint de registro del backend (para Admins).
 */
export function registerService(username, email, password, role) {
  const requestBody = {
    Username: username,
    Email: email,
    Password: password,
    Role: role,
  };

  return api.post('/auth/register', requestBody);
}