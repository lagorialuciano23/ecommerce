import { api } from "../../shared/services/api";

export const productService = {
  getAll: () => api.get('/api/products'),

  getById: (id) => api.get(`/api/products/${id}`),

  create: (product) => api.post('/api/products', product),

  update: (id, product) => api.put(`/api/products/${id}`, product),
  
  delete: (id) => api.delete(`/api/products/${id}`),
};