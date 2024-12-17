import express from 'express';
import { PedidosService } from '../services/pedidos.service.js';
import { validarPedido } from '../validations/pedidos.validation.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware para manejar validaciones
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Ruta para realizar un pedido
router.post('/:usuarioId', validarPedido, handleValidation, async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const { direccionEnvio, metodoPago } = req.body;

    const pedido = await PedidosService.realizarPedido(usuarioId, direccionEnvio, metodoPago);
    res.status(201).json({ mensaje: 'Pedido realizado con éxito', pedido });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
