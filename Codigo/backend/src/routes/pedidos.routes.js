import express from 'express';

import { pedidosService } from '../services/pedidos.service.js';
import { validarCrearPedido } from '../validations/pedidos.validation.js';
import { validationResult } from 'express-validator';



const router = express.Router();


router.post('/:usuarioId', validarCrearPedido, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const usuarioId = parseInt(req.params.usuarioId, 10);
  const { direccionEnvio, metodoPagoId, metodoEnvioId, productos } = req.body;

  try {
    const resultado = await pedidosService.crearPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      productos
    );
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;