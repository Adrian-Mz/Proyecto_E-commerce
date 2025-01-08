import express from 'express';
import { estadoService } from '../services/estado.service.js';

const router = express.Router();

// Obtener todos los estados
router.get('/', async (req, res) => {
  try {
    const estados = await estadoService.obtenerEstados();
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar el estado de un pedido
router.put('/pedidos/:pedidoId/estado', async (req, res) => {
  const { pedidoId } = req.params;
  const { nuevoEstadoId } = req.body;

  try {
    const pedidoActualizado = await estadoService.actualizarEstadoPedido(
      parseInt(pedidoId, 10),
      parseInt(nuevoEstadoId, 10)
    );
    res.status(200).json({ mensaje: "Estado actualizado correctamente.", pedido: pedidoActualizado });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



export default router;
