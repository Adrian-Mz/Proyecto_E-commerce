import express from 'express';
import { pedidosService } from '../services/pedidos.service.js';
import { validarCrearPedido } from '../validations/pedidos.validation.js';
import { validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';

const router = express.Router();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener pedidos (historial, específico o todos)
router.get('/:pedidoId?', verificarToken, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const pedidoId = req.params.pedidoId ? parseInt(req.params.pedidoId, 10) : null;
    const esAdmin = req.usuario.rol === 'Administrador'; // Verifica si es admin

    const pedidos = await pedidosService.obtenerPedidos({ usuarioId, pedidoId, esAdmin });
    res.status(200).json({ pedidos });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Crear un nuevo pedido
router.post('/:usuarioId', validarCrearPedido, handleValidationErrors, async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const { direccionEnvio, metodoPagoId, metodoEnvioId, detallesPago } = req.body;

  try {
    console.log('Recibiendo datos para crear pedido:', req.body);
    const resultado = await pedidosService.crearPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      detallesPago
    );

    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear el pedido o procesar el pago:', error.message);
    res.status(400).json({ error: error.message });
  }
});


// Ruta para eliminar un pedido
router.delete("/:pedidoId", async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const resultado = await pedidosService.eliminarPedido(parseInt(pedidoId, 10));
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Obtener estado del pedido y fecha estimada de entrega
router.get('/:pedidoId/estado', async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const estadoPedido = await pedidosService.obtenerEstadoPedido(parseInt(pedidoId, 10));
    res.status(200).json(estadoPedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;
