import express from 'express';
import { CarritoService } from '../services/carrito.service.js';
import { validarCarrito } from '../validations/carrito.validation.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware para manejar errores de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener el carrito
router.get('/:usuarioId', validarCarrito.obtenerCarrito, handleValidation, async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const carrito = await CarritoService.obtenerCarrito(usuarioId);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Añadir producto al carrito
router.post('/:usuarioId', validarCarrito.agregarProducto, handleValidation, async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const { productoId, cantidad } = req.body;
    const carrito = await CarritoService.addProductToCart(usuarioId, productoId, cantidad);
    res.status(201).json(carrito);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Actualizar cantidad de un producto en el carrito
router.put('/:usuarioId', validarCarrito.actualizarProducto, handleValidation, async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const { productoId, cantidad } = req.body;

    const carrito = await CarritoService.updateProductInCart(usuarioId, productoId, cantidad);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Eliminar un producto del carrito
router.delete('/:usuarioId/:productoId', async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const productoId = parseInt(req.params.productoId, 10);
    const carrito = await CarritoService.removeProductFromCart(usuarioId, productoId);
    res.status(200).json({ mensaje: 'Producto eliminado del carrito.', carrito });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vaciar el carrito
router.delete('/:usuarioId', async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const carrito = await CarritoService.clearCart(usuarioId);
    res.status(200).json({ mensaje: 'Carrito vaciado correctamente.', carrito });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;
