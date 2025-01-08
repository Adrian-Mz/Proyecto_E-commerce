import express from 'express';
import { devolucionesService } from '../services/devoluciones.service.js';

const router = express.Router();

// Obtener una devolución por ID
router.get('/:devolucionId', async (req, res) => {
    const { devolucionId } = req.params;
  
    try {
      const devolucion = await devolucionesService.obtenerDevolucionPorId(parseInt(devolucionId, 10));
      if (!devolucion) {
        return res.status(404).json({ mensaje: `No se encontró una devolución con el ID ${devolucionId}.` });
      }
  
      res.status(200).json(devolucion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Registrar una solicitud de devolución
router.post('/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  const { motivo } = req.body;

  try {
    const devolucion = await devolucionesService.registrarDevolucion(parseInt(pedidoId, 10), motivo);
    res.status(201).json({ mensaje: 'Devolución registrada correctamente.', devolucion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar el estado de una devolución
router.put('/:devolucionId', async (req, res) => {
  const { devolucionId } = req.params;
  const { nuevoEstadoId } = req.body;

  try {
    const devolucionActualizada = await devolucionesService.actualizarEstadoDevolucion(
      parseInt(devolucionId, 10),
      parseInt(nuevoEstadoId, 10)
    );
    res.status(200).json({ mensaje: 'Estado de la devolución actualizado correctamente.', devolucion: devolucionActualizada });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
