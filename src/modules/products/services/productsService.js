import { api } from '../../shared/services/api';

// Mapea los nombres del formulario (camelCase) a los nombres del DTO (PascalCase)
const mapProductToRequest = (product) => {
  return {
    Sku: product.sku,
    InternalCode: product.internalCode,
    Name: product.name,
    Description: product.description,
    CurrentUnitPrice: parseFloat(product.currentUnitPrice), // Asegurarnos que sea un número
    StockQuantity: parseInt(product.stockQuantity, 10), // Asegurarnos que sea un entero
    ImageUrl: product.imageUrl || null,
    IsActive: product.isActive,
  };
};

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

  getAll: (pageNumber = 1, pageSize = 8, search = '') =>{
    const params = new URLSearchParams();

    params.append('pageNumber', pageNumber);
    params.append('pageSize', pageSize);

    if (search) {
      params.append('search', search);
    }

    return api.get(`/products?${params.toString()}`);
  },

  getProducts: () => api.get('/products/total'),

  getProductSummary: () => api.get('/products/summary'),

  getActiveProducts: (pageNumber = 1, pageSize = 8, search = '') => {
    const params = new URLSearchParams();

    params.append('pageNumber', pageNumber);
    params.append('pageSize', pageSize);

    if (search) {
      params.append('search', search);
    }

    return api.get(`/products/active?${params.toString()}`);
  },

  /**
   * Obtiene un producto por su ID.
   * GET /products/{id}
   * @param {number|string} id - ID del producto
   * @returns {Promise<object>} Producto encontrado
   */
  getById: (id) => api.get(`/products/${id}`),

  /**
   * Crea un nuevo producto.
   * POST /api/products
   * @param {object} product - Datos del producto a crear
   * @returns {Promise<object>} Producto creado
   */
  create: (product) => {
    const productData = mapProductToRequest(product);

    return api.post('/products', productData);
  },

  /**
   * Actualiza un producto existente completamente.
   * PUT /products/{id}
   * @param {number|string} id - ID del producto
   * @param {object} product - Datos actualizados del producto
   * @returns {Promise<object>} Producto actualizado
   */
  update: (id, product) => {
    const productData = mapProductToRequest(product);

    return api.put(`/products/${id}`, productData);
  },

  /**
   * Actualiza parcialmente un producto.
   * PATCH /products/{id}
   * @param {number|string} id - ID del producto
   * @param {object} updates - Campos a actualizar
   * @returns {Promise<object>} Producto actualizado
   */
  partialUpdate: (id, updates) => api.patch(`/products/${id}`, updates),

  /**
   * Elimina un producto.
   * DELETE /products/{id}
   * @param {number|string} id - ID del producto
   * @returns {Promise<void>}
   */
  delete: (id) => api.delete(`/products/${id}`),
};