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
  },

  descargarReporte: async () => {
    try {
      const response = await api.get("/reportesVentas/generar", {
        responseType: "blob", // 📌 Importante para recibir archivos binarios
      });

      // Crear un objeto URL y forzar la descarga
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_general.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Error descargando el reporte:", error.response?.data || error.message);
    }
  },
};