import api from "./api.config";

export const NotificacionesAPI = {
  // Obtener notificaciones del usuario
  getNotificaciones: async () => {
    try {
      const response = await api.get("/notificaciones");
      return response.data;
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      throw error;
    }
  },

  // Marcar una notificación como leída
  marcarComoLeida: async (notificacionId) => {
    try {
      await api.put(`/notificaciones/${notificacionId}/leida`);
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
      throw error;
    }
  }
};