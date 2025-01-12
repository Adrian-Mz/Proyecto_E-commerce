import api from './api.config';

export const PromocionesService = {
  // Obtener todas las promociones
  async getPromociones() {
    try {
      const response = await api.get('/promociones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener promociones:', error.response?.data || error.message);
      throw error;
    }
  },

  // Crear una nueva promoción
  async createPromocion(promocionData) {
    try {
      const response = await api.post('/promociones', promocionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear promoción:', error.response?.data || error.message);
      throw error;
    }
  },

  // Actualizar una promoción existente
  async updatePromocion(promocionId, promocionData) {
    try {
      const response = await api.put(`/promociones/${promocionId}`, promocionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la promoción con ID ${promocionId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Eliminar una promoción
  async deletePromocion(promocionId) {
    try {
      const response = await api.delete(`/promociones/${promocionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la promoción con ID ${promocionId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};
