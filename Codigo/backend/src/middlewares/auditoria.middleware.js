import { auditoriaService } from "../services/auditoria.service.js";

export const logAction = (tabla_afectada, accion) => {
  return async (req, res, next) => {
    const { user } = req; // Suponiendo que `user` contiene datos del usuario autenticado
    const registro = JSON.stringify(req.body); // Registro con los datos enviados en la solicitud
    try {
      await auditoriaService.registrarAccion({
        usuarioId: user?.id || null, // Si no hay usuario, será null (acciones del sistema)
        tabla_afectada,
        accion,
        registro,
        descripcion_cambio: req.body.descripcion || null,
      });
      next();
    } catch (error) {
      console.error("Error registrando en auditoría:", error.message);
      next(); // No bloqueamos el flujo si la auditoría falla
    }
  };
};
