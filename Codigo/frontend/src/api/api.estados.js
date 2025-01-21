import api from "./api.config";

export const EstadosAPI = {
  // Obtener todos los estados
  getEstados: async () => {
    try {
      const response = await api.get("/estado");
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Ocurrió un error inesperado al cargar los estados.";
    }
  },

  // Actualizar el estado de un pedido
  updateEstadoPedido: async (pedidoId, nuevoEstadoId) => {
    try {
      const response = await api.put(`/estado/pedidos/${pedidoId}/estado`, {
        nuevoEstadoId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Ocurrió un error inesperado al actualizar el estado.";
    }
  },
};
