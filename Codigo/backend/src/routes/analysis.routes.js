// routes/analysis.routes.js
import { Router } from 'express';
import { AnalysisService } from '../services/analysis.service.js';

const router = Router();

router.post('/recomendaciones', async (req, res) => {
    const { textoCategoria, siteId } = req.body;
  
    try {
      if (!textoCategoria || !siteId) {
        return res.status(400).json({ error: 'El texto de la categoría y el ID del sitio son obligatorios.' });
      }
  
      const datosLocales = []; // Puedes conectar tus datos locales aquí
      const recomendaciones = await AnalysisService.generarRecomendaciones(datosLocales, textoCategoria, siteId);
  
      res.status(200).json({ recomendaciones });
    } catch (error) {
      console.error('Error en el servicio de análisis:', error.message);
      res.status(500).json({ error: error.message });
    }
});

export default router;


