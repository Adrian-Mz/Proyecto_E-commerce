import api from './api.config';

export const ProductosAPI = {
  getAllProductos: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getProductoById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  createProducto: async (productoData) => {
    const response = await api.post('/productos', productoData);
    return response.data;
  },

  updateProducto: async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData);
    return response.data;
  },

  deleteProducto: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};
