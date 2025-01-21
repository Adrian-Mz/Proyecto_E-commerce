import api from './api.config';

export const PedidosAPI = {
    // Obtener todos los pedidos
  getPedidos: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los pedidos:', error.response?.data || error.message);
      throw error;
    }
  },

  getHistorialPedidos: async () => {
    try {
      const response = await api.get("/pedidos/historial");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el historial de pedidos:", error.response?.data || error.message);
      throw error;
    }
  },
  
  // Obtener un pedido específico del usuario autenticado
  getPedido: async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el pedido:", error.response?.data || error.message);
      throw error;
    }
  },

  // Crear un nuevo pedido
  createPedido: async (usuarioId, pedidoData) => {
    try {
      const response = await api.post(`/pedidos/${usuarioId}`, pedidoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener el estado de un pedido
  getEstadoPedido: async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/estado`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el estado del pedido:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener todos los métodos de envío
  getMetodosEnvio: async () => {
    try {
      const response = await api.get('/metodo_envio');
      return response.data;
    } catch (error) {
      console.error('Error al obtener métodos de envío:', error);
      throw error;
    }
  },

  // Obtener todos los métodos de pago
  getMetodosPago: async () => {
    try {
      const response = await api.get('/metodo_pago');
      return response.data;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  },
};
