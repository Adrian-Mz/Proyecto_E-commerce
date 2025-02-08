import express from 'express';
import { devolucionesService } from '../services/devoluciones.service.js';
import { verificarToken} from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';

const router = express.Router();

// Obtener productos elegibles para devolución (de pedidos entregados)
router.get('/productos-elegibles/:usuarioId', async (req, res) => {
  try {
      const productos = await devolucionesService.obtenerProductosElegibles(parseInt(req.params.usuarioId));
      res.json(productos);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Obtener todas las devoluciones
router.get('/', async (req, res) => {
  try {
      const devoluciones = await devolucionesService.obtenerTodasLasDevoluciones();
      res.json(devoluciones);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Obtener una devolución por ID
router.get('/:id', async (req, res) => {
  try {
      const devolucion = await devolucionesService.obtenerDevolucionPorId(parseInt(req.params.id));
      res.json(devolucion);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Registrar una devolución de producto
router.post('/', async (req, res) => {
  try {
      const { pedidoId, productoId, cantidad, motivo } = req.body;
      const resultado = await devolucionesService.registrarDevolucion(pedidoId, productoId, cantidad, motivo);
      res.json(resultado);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Actualizar estado de devolución
router.put('/:id/estado', async (req, res) => {
  try {
      const resultado = await devolucionesService.actualizarEstadoDevolucion(parseInt(req.params.id), req.body.estadoId);
      res.json(resultado);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

export default router;
