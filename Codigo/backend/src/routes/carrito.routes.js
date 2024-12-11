import express from 'express';
import { CarritoService } from '../services/carrito.service.js';

const router = express.Router();


// Obtener el carrito de un usuario específico
router.get('/:usuarioId', async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const carrito = await CarritoService.obtenerCarrito(usuarioId);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


// Ejemplo de ruta
router.post('/:carritoId/productos', async (req, res) => {
  try {
    const { carritoId } = req.params;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ error: 'ProductoId y cantidad son obligatorios' });
    }

    const resultado = await CarritoService.agregarProductoAlCarrito(parseInt(carritoId, 10), productoId, cantidad);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; // Exportación por defecto
