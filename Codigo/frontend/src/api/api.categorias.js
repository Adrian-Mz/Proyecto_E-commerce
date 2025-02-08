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

  // Crear una nueva categoría con IVA
  async createCategoria(categoriaData) {
    try {
      const response = await api.post("/categorias", {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion,
        categoria_iva: {
          create: {
            ivaPorcentaje: parseFloat(categoriaData.ivaPorcentaje) || "", // 🔹 Se envía como decimal en la relación correcta
          },
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear categoría:", error.response?.data || error.message);
      throw error.response?.data || { error: "Error al crear la categoría." };
    }
  },

  // Actualizar una categoría con IVA
  async updateCategoria(id, categoriaData) {
    try {
      const response = await api.put(`/categorias/${id}`, {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion,
        ivaPorcentaje: categoriaData.ivaPorcentaje, // 🔹 Enviar el IVA actualizado
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar categoría con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Eliminar una categoría
  async deleteCategoria(id) {
    try {
      const response = await api.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};