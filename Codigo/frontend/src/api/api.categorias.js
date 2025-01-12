import api from './api.config';

export const CategoriasService = {
  // Obtener todas las categorías
  async getCategorias() {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  async getCategoriaById(id) {
    try {
      const response = await api.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la categoría con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva categoría
  async createCategoria(categoriaData) {
    try {
      const response = await api.post("/categorias", categoriaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  async updateCategoria(id, categoriaData) {
    try {
      const response = await api.put(`/categorias/${id}`, categoriaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar categoría con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una categoría
  async deleteCategoria(id) {
    try {
      const response = await api.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error);
      throw error;
    }
  },
};
