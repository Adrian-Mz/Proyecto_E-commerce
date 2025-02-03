import express from "express";
import { auditoriaService } from "../services/auditoria.service.js";

const router = express.Router();

// Obtener todos los eventos de auditoría
router.get("/", async (req, res) => {
  try {
    const auditoria = await auditoriaService.obtenerEventos();
    res.status(200).json(auditoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener auditoría" });
  }
});

export default router;
