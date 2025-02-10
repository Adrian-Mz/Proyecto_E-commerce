import express from 'express';
import { ReporteService } from './reporte.service.js';

const router = express.Router();

router.get('/generar', async (req, res) => {
  try {
    await ReporteService.generarReporte(res);
  } catch (error) {
    res.status(500).json({ error: "Error al generar el reporte." });
  }
});

export default router;