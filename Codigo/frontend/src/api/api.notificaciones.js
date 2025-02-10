import api from "./api.config";

export const NotificacionesAPI = {
  // 🔹 Obtener notificaciones del usuario autenticado
  getNotificaciones: async () => {
    try {
      const response = await api.get("/notificaciones");
      return response.data;
    } catch (error) {
      console.error(" Error al obtener notificaciones:", error);
      return [];
    }
  },

  // 🔹 Marcar una notificación como leída
  marcarComoLeida: async (notificacionId) => {
    try {
      await api.put(`/notificaciones/${notificacionId}/leida`);
    } catch (error) {
      console.error(" Error al marcar notificación como leída:", error);
    }
  }
};
