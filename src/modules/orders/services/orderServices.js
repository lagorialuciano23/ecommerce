import { api } from '../../shared/services/api';

/**
 * Servicio para gestionar las operaciones de Órdenes.
 */
export const ordersService = {
  /**
   * Obtiene una lista paginada de órdenes.
   * @param {number} pageNumber - El número de página para solicitar.
   * @param {number} pageSize - El tamaño de la página.
   * @param {string} status - (AÚN NO IMPLEMENTADO EN BACKEND) El estado para filtrar.
   * @param {string} search - (AÚN NO IMPLEMENTADO EN BACKEND) El término de búsqueda.
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
};