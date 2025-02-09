import api from './api.config';

export const DevolucionesService = {
  // Obtener todas las devoluciones
  obtenerTodasLasDevoluciones: async () => {
    try {
      const response = await api.get('/devoluciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las devoluciones:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener una devolución por ID
  obtenerDevolucionPorId: async (devolucionId) => {
    try {
      const response = await api.get(`/devoluciones/${devolucionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la devolución con ID ${devolucionId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener productos elegibles para devolución de un usuario
  obtenerProductosElegibles: async (usuarioId) => {
    try {
      const response = await api.get(`/devoluciones/productos-elegibles/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener productos elegibles para usuario ${usuarioId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Registrar una devolución (ahora por producto individualmente)
  registrarDevolucion: async (pedidoId, productoId, cantidad, motivo) => {
    try {
        const response = await api.post(`/devoluciones`, {
            pedidoId,
            productoId,
            cantidad,
            motivo
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar devolución:', error.response?.data || error.message);
        throw error;
    }
  },

  // Actualizar el estado de una devolución (solo Administradores)
  actualizarEstadoDevolucion: async (devolucionId, estadoId) => {
    try {
      const response = await api.put(`/devoluciones/${devolucionId}/estado`, { estadoId });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la devolución con ID ${devolucionId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};
