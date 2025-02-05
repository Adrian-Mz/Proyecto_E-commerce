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

  // Registrar una devolución con productos específicos
    registrarDevolucion: async (pedidoId, productosDevueltos) => {
        try {
            if (!Array.isArray(productosDevueltos)) {
                throw new Error("El parámetro productosDevueltos debe ser un array.");
            }

            const response = await api.post(`/devoluciones/${pedidoId}`, {
                productosDevueltos: productosDevueltos.map(p => ({
                    productoId: p.productoId,
                    cantidad: p.cantidad,
                    motivo: p.motivo || "Motivo no especificado"
                }))
            });

            return response.data;
        } catch (error) {
            console.error('Error al registrar devolución:', error.response?.data || error.message);
            throw error;
        }
    },

  // Actualizar el estado de una devolución (solo Administradores)
  actualizarEstadoDevolucion: async (devolucionId, estado) => {
    try {
      const response = await api.put(`/devoluciones/${devolucionId}`, { estado });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la devolución con ID ${devolucionId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Actualizar el estado de un producto dentro de una devolución (solo Administradores)
  actualizarEstadoProductoDevuelto: async (devolucionId, productoId, nuevoEstadoId) => {
    try {
      const response = await api.put(`/devoluciones/${devolucionId}/producto/${productoId}/estado`, { nuevoEstadoId });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del producto ${productoId} en la devolución ${devolucionId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};
