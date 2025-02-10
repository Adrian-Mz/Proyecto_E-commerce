import express from 'express';
import { ReportsService } from './reports.service.js';


const router = express.Router();

// Ruta para obtener todos los datos completos
router.get('/general', async (req, res) => {
  try {
    const reporteCompleto = await ReportsService.getReporteCompleto();
    res.json(reporteCompleto);
  } catch (error) {
    console.error("Error al obtener el reporte completo: ", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
