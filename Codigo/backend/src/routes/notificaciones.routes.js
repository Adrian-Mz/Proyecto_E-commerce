import express from "express";
import { notificacionesService } from "../services/notificaciones.service.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Obtener notificaciones del usuario autenticado
router.get("/", verificarToken, async (req, res) => {
  try {
    const notificaciones = await notificacionesService.obtenerNotificaciones(req.usuario.id);
    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar una notificación como leída
router.put("/:id/leida", verificarToken, async (req, res) => {
  try {
    await notificacionesService.marcarComoLeida(parseInt(req.params.id, 10));
    res.status(200).json({ mensaje: "Notificación marcada como leída" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
