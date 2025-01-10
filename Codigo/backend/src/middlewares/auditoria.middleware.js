import { auditoriaService } from '../services/auditoria.service.js';

export const registrarAccion = (tablaAfectada, accion) => {
  return async (req, res, next) => {
    try {
      const { user } = req; // Datos del usuario autenticado (si existe)
      const registro = JSON.stringify(req.body); // Datos del cuerpo de la solicitud

      await auditoriaService.registrarAccion({
        usuarioId: user?.id || null, // Si no hay usuario autenticado, será null
        tabla_afectada: tablaAfectada,
        accion: accion,
        registro,
        descripcion_cambio: req.body.descripcion || null, // Agrega una descripción si está presente
      });
      next();
    } catch (error) {
      console.error('Error registrando auditoría:', error.message);
      next(); // No bloquea la operación si falla el registro de auditoría
    }
  };
};
