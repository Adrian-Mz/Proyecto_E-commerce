import express from 'express';
import { promocionesService } from '../services/promociones.service.js';

const router = express.Router();

// Obtener todas las promociones
router.get('/', async (req, res) => {
  try {
    const promociones = await promocionesService.obtenerPromociones();
    res.status(200).json(promociones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva promoción
router.post('/', async (req, res) => {
  try {
    const nuevaPromocion = await promocionesService.crearPromocion(req.body);
    res.status(201).json({ mensaje: 'Promoción creada exitosamente.', promocion: nuevaPromocion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una promoción existente
router.put('/:promocionId', async (req, res) => {
  const { promocionId } = req.params;
  try {
    const promocionActualizada = await promocionesService.actualizarPromocion(parseInt(promocionId, 10), req.body);
    res.status(200).json({ mensaje: 'Promoción actualizada exitosamente.', promocion: promocionActualizada });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una promoción
router.delete('/:promocionId', async (req, res) => {
  const { promocionId } = req.params;
  try {
    await promocionesService.eliminarPromocion(parseInt(promocionId, 10));
    res.status(200).json({ mensaje: 'Promoción eliminada exitosamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
