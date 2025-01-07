import express from 'express';
import { pedidosService } from '../services/pedidos.service.js';
import { validarCrearPedido } from '../validations/pedidos.validation.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Crear un nuevo pedido
router.post('/:usuarioId', validarCrearPedido, handleValidationErrors, async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const { direccionEnvio, metodoPagoId, metodoEnvioId, detallesPago } = req.body;

  try {
    const resultado = await pedidosService.crearPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      detallesPago
    );
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un pedido específico por usuario
router.get('/:usuarioId/pedidos/:pedidoId', async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const pedidoId = parseInt(req.params.pedidoId, 10);

  try {
    const pedido = await pedidosService.obtenerPedidoDeUsuario(usuarioId, pedidoId);
    res.status(200).json(pedido);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
