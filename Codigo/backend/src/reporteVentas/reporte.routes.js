import { Router } from 'express';
import { ReporteService } from './reporte.service.js';

const router = Router();

router.get('/generar', (req, res) => {
  ReporteService.generarReporte(req, res);
});

export default router;
