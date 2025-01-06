import api from '../api/api.config';

export const ProductosService = {
  // Obtener todos los productos
  async getProductos() {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getProductoById(id) {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProducto(productoData) {
    try {
      const response = await api.post('/productos', productoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  async updateProducto(id, productoData) {
    try {
      const response = await api.put(`/productos/${id}`, productoData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el producto con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProducto(id) {
    try {
      await api.delete(`/productos/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${id}:`, error);
      throw error;
    }
  },
  
  // Obtener productos por categoría
  async getProductosPorCategoria(categoriaId) {
    try {
      const response = await api.get(`/productos?categoriaId=${categoriaId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  },

  // Obtener productos por rango de precios
  async getProductosFiltradosPorPrecio(min, max) {
    try {
      const response = await api.get(`/productos?precioMin=${min}&precioMax=${max}`);
      return response.data;
    } catch (error) {
      console.error('Error al filtrar productos por precio:', error);
      throw error;
    }
  },
};
