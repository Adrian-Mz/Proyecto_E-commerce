import api from './api.config';

export const PromocionesService = {
  // Obtener todas las promociones
  async getPromociones() {
    try {
      const response = await api.get('/promociones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener promociones:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || 'Error al obtener promociones'
      );
    }
  },

  // Crear una nueva promoción
  async createPromocion(promocionData) {
    try {
      const response = await api.post('/promociones', promocionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear promoción:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || 'Error al crear promoción'
      );
    }
  },

  // Actualizar una promoción existente
  async updatePromocion(promocionId, promocionData) {
    try {
      const response = await api.put(`/promociones/${promocionId}`, promocionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la promoción con ID ${promocionId}:`, error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || `Error al actualizar promoción con ID ${promocionId}`
      );
    }
  },

  // Eliminar una promoción
  async deletePromocion(promocionId) {
    try {
      const response = await api.delete(`/promociones/${promocionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la promoción con ID ${promocionId}:`, error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || `Error al eliminar promoción con ID ${promocionId}`
      );
    }
  },

  // Asignar una promoción a una categoría
  async asignarPromocionACategoria(categoriaId, promocionId) {
    try {
      const response = await api.post('/promociones/asignar-categoria', {
        categoriaId,
        promocionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error al asignar promoción a categoría:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || 'Error al asignar promoción a la categoría'
      );
    }
  },
};
