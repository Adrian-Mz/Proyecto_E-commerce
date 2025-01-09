import express from "express";
import { auditoriaService } from "../services/auditoria.service.js";
import { verifyRole } from "../middlewares/roles.middleware.js";

const router = express.Router();

// Obtener registros de auditoría (solo administradores)
router.get("/", verifyRole("Administrador"), async (req, res) => {
  try {
    const registros = await auditoriaService.obtenerRegistros();
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
