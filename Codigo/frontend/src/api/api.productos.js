import api from './api.config';

export const ProductosService = {
  getProductos: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error.response?.data || error.message);
      throw error;
    }
  },

  getProductoById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  createProducto: async (productoData) => {
    try {
      const response = await api.post('/productos', productoData); // No configures "Content-Type"
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error.response?.data || error.message);
      throw error;
    }
  },  

  updateProducto: async (id, productoData) => {
    try {
      const response = await api.put(`/productos/${id}`, productoData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Asegurar autenticación si aplica
      });
  
      return response.data.producto; // Devuelve solo el producto actualizado
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteProducto: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getProductosPorCategoria: async (categoriaId) => {
    try {
      const response = await api.get(`/productos?categoriaId=${categoriaId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error.response?.data || error.message);
      throw error;
    }
  },

  getProductosFiltradosPorPrecio: async (min, max) => {
    try {
      const response = await api.get(`/productos?precioMin=${min}&precioMax=${max}`);
      return response.data;
    } catch (error) {
      console.error('Error al filtrar productos por precio:', error.response?.data || error.message);
      throw error;
    }
  },

  // 🔍 Método para buscar productos con autocompletado
  buscarProductos: async (query, limit = 5) => {
    try {
      const response = await api.get(`/productos/buscar?q=${query}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar productos:', error.response?.data || error.message);
      throw error;
    }
  },

  // 🔄 Obtener productos similares (misma categoría o marca)
  getProductosSimilares: async (productoId, categoriaId, marca) => {
    try {
      const response = await api.get(`/productos/similares?productoId=${productoId}&categoriaId=${categoriaId}&marca=${marca}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos similares:', error.response?.data || error.message);
      throw error;
    }
  },
};
