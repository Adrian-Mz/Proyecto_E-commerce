import { auditoriaData } from "../data/auditoria.data.js";

export const auditoriaService = {
  async registrarEvento(usuarioId, tablaAfectada, accion, registro, descripcionCambio = null) {
    try {
      return await auditoriaData.registrarEvento(usuarioId, tablaAfectada, accion, registro, descripcionCambio);
    } catch (error) {
      console.error("Error en el servicio de auditoría:", error);
      throw new Error("No se pudo registrar la auditoría");
    }
  },

  async obtenerEventos() {
    try {
      return await auditoriaData.obtenerEventos();
    } catch (error) {
      console.error("Error al obtener eventos de auditoría:", error);
      throw new Error("No se pudieron obtener los registros de auditoría");
    }
  },
};
