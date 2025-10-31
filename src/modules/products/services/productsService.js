import { api } from "../../shared/services/api";

/**
 * Servicio para gestionar operaciones relacionadas con productos.
 * Todas las validaciones se realizan en el backend.
 */
export const productsService = {
  /**
   * Obtiene todos los productos.
   * GET /api/products
   * @returns {Promise<Array>} Lista de productos
   */
  getAll: () => api.get('/api/products'),

  /**
   * Obtiene un producto por su ID.
   * GET /api/products/{id}
   * @param {number|string} id - ID del producto
   * @returns {Promise<object>} Producto encontrado
   */
  getById: (id) => api.get(`/api/products/${id}`),

  /**
   * Crea un nuevo producto.
   * POST /api/products
   * @param {object} product - Datos del producto a crear
   * @returns {Promise<object>} Producto creado
   */
  create: (product) => api.post('/api/products', product),

  /**
   * Actualiza un producto existente completamente.
   * PUT /api/products/{id}
   * @param {number|string} id - ID del producto
   * @param {object} product - Datos actualizados del producto
   * @returns {Promise<object>} Producto actualizado
   */
  update: (id, product) => api.put(`/api/products/${id}`, product),

  /**
   * Actualiza parcialmente un producto.
   * PATCH /api/products/{id}
   * @param {number|string} id - ID del producto
   * @param {object} updates - Campos a actualizar
   * @returns {Promise<object>} Producto actualizado
   */
  partialUpdate: (id, updates) => api.patch(`/api/products/${id}`, updates),

  /**
   * Elimina un producto.
   * DELETE /api/products/{id}
   * @param {number|string} id - ID del producto
   * @returns {Promise<void>}
   */
  delete: (id) => api.delete(`/api/products/${id}`),
};