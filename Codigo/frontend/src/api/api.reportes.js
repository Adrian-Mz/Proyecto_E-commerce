import api from "./api.config";

export const ReportesAPI = {
  // 🔹 Obtener datos completos del reporte general
  getGeneral: async () => {
    try {
      const response = await api.get("/reportes/general"); // Asegúrate de que esta ruta es la correcta en el backend
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo el reporte general:", error.response?.data || error.message);
      return null;
    }
  }
};