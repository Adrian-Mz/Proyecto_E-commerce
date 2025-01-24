import express from 'express';
import { AnalisisService } from '../services/analisis.service.js';

const router = express.Router();

// Endpoint para obtener predicciones
router.get('/predicciones', async (req, res) => {
  try {
    const resultados = await AnalisisService.obtenerPredicciones();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
