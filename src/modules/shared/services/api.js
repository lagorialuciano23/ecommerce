/**
 * Función auxiliar para obtener el token de localStorage.
 */

function getToken() {
  return localStorage.getItem('token');
}

/**
 * Función base para realizar todas las peticiones fetch,
 * inyectando el token de autenticación automáticamente.
 * * @param {string} endpoint El endpoint de la API (ej. '/api/products')
 * @param {object} options Opciones de fetch (method, body, etc.)
 * @returns {Promise<any>} La respuesta JSON del servidor
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  // 1. Configuración de los encabezados (headers)
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // 2. Si tenemos un token, lo añadimos al encabezado de Autorización
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 3. Unimos los headers por defecto con los que pasemos en las opciones
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // 4. Realizamos la petición usando el proxy de Vite (ej. /api/...)
  const response = await fetch(endpoint, config);

  // 5. Manejo de la respuesta
  if (!response.ok) {
    let errorInfo;

    // Intentamos leer el error como JSON (como lo envía tu Middleware de C#)
    try {
      errorInfo = await response.json();
    } catch (e) {
      // Si el backend falla con un 500 (HTML) o un 401 (texto simple)
      errorInfo = {
        message: `Error ${response.status}: ${response.statusText || 'Error del servidor'}`,
      };
    }

    // Si el error es 401 (No autorizado), podríamos querer desloguear al usuario
    if (response.status === 401) {
      // Opcional: Desloguear automáticamente si el token es inválido
      // (Podríamos implementar esto más adelante con el AuthContext)
      console.error('Error 401: No autorizado. El token puede ser inválido o haber expirado.');
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    }

    // Lanzamos un error estructurado
    throw new Error(errorInfo.message || 'Error desconocido');
  }

  // 6. Si todo salió bien, devolvemos la respuesta JSON
  // Manejamos el caso de que la respuesta sea exitosa pero no tenga contenido (ej. DELETE 204 No Content)
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // Si no hay JSON (ej. 204 No Content), simplemente retornamos
  return;
}

// Exportamos un objeto 'api' con los métodos comunes (GET, POST, etc.)
export const api = {
  /**
     * Realiza una petición GET autenticada.
     * @param {string} endpoint El endpoint de la API (ej. '/api/products')
     * @param {object} options Opciones de fetch adicionales
     */
  get: (endpoint, options = {}) =>
    apiFetch(endpoint, { ...options, method: 'GET' }),

  /**
     * Realiza una petición POST autenticada.
     * @param {string} endpoint El endpoint de la API
     * @param {object} body El cuerpo (body) de la petición
     * @param {object} options Opciones de fetch adicionales
     */
  post: (endpoint, body, options = {}) =>
    apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  /**
     * Realiza una petición PUT autenticada.
     * @param {string} endpoint El endpoint de la API
     * @param {object} body El cuerpo (body) de la petición
     * @param {object} options Opciones de fetch adicionales
     */
  put: (endpoint, body, options = {}) =>
    apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  /**
     * Realiza una petición PATCH autenticada.
     * @param {string} endpoint El endpoint de la API
     * @param {object} body El cuerpo (body) de la petición
     * @param {object} options Opciones de fetch adicionales
     */
  patch: (endpoint, body, options = {}) =>
    apiFetch(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

  /**
     * Realiza una petición DELETE autenticada.
     * @param {string} endpoint El endpoint de la API
     * @param {object} options Opciones de fetch adicionales
     */
  delete: (endpoint, options = {}) =>
    apiFetch(endpoint, { ...options, method: 'DELETE' }),
};