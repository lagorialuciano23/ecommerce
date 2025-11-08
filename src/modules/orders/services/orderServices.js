import { api } from '../../shared/services/api';

/**
 * Servicio para gestionar las operaciones de Órdenes.
 */
export const ordersService = {
  /**
   * Obtiene una lista paginada de órdenes.
   * @param {number} pageNumber - El número de página para solicitar.
   * @param {number} pageSize - El tamaño de la página.
   * @param {string} status - El estado para filtrar.
   * @param {string} search - El término de búsqueda.
   * @returns {Promise<Array>} Lista de órdenes
   */
  getAll: (pageNumber = 1, pageSize = 8, status = '', search = '') => {
    // Construimos los parámetros de la URL
    const params = new URLSearchParams();

    params.append('pageNumber', pageNumber);
    params.append('pageSize', pageSize);

    if (status) {
      params.append('status', status);
    }

    if (search) {
      params.append('search', search);
    }

    return api.get(`/api/orders?${params.toString()}`);
  },

  /**
   * Obtiene una orden por su ID.
   * GET /api/orders/{id}
   */
  getById: (id) => {
    return api.get(`/api/orders/${id}`);
  },

  /**
   * Actualiza el estado de una orden (Admin).
   * PATCH /api/orders/{id}/status
   */
  updateStatus: (id, newStatus) => {
    // El backend espera un string simple, no un JSON
    // Por eso, ajustamos apiFetch para enviar texto plano
    return api.patch(`/api/orders/${id}/status`, newStatus, {
      'Content-Type': 'application/json', // El backend espera un string JSON
    });
  },
  /**
   * Crea una nueva orden.
   * POST /api/orders
   * @param {object} orderPayload - El DTO que espera el backend
   * @returns {Promise<object>} La orden creada
   */
  create: (orderPayload) => {
    // api.post ya incluye el token de autorización
    return api.post('/api/orders', orderPayload);
  },
};