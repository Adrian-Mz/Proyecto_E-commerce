import express from 'express';
import { CarritoService } from '../services/carrito.service.js';
import { validarCarrito } from '../validations/carrito.validation.js';
import { handleValidation } from '../middlewares/handleValidation.js';
import { verificarToken} from '../middlewares/auth.middleware.js';

const router = express.Router();

/////////////////////////////////////////////////////CARRITO TEMPORAL//////////////////////////////////////////////////////////////////////

// Obtener el carrito temporal
router.get('/temporal', async (req, res) => {
  try {
    const carrito = req.session.carrito || [];
    const carritoConDetalles = await CarritoService.obtenerCarritoTemporal(carrito);
    res.status(200).json(carritoConDetalles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Agregar productos al carrito temporal
router.post('/temporal', async (req, res) => {
  try {
    const productos = req.body; // Corregido: aquí obtienes los productos enviados en la solicitud

    if (!Array.isArray(productos)) {
      return res.status(400).json({ error: 'El cuerpo debe ser un array de productos.' });
    }

    console.log('Productos recibidos:', productos); // Productos enviados correctamente
    console.log('Carrito temporal antes de agregar:', req.session.carrito);

    req.session.carrito = req.session.carrito || [];
    const carritoActualizado = await CarritoService.agregarProductoCarritoTemporal(
      productos,
      req.session.carrito
    );

    req.session.carrito = carritoActualizado;
    res.status(201).json({ mensaje: 'Productos agregados.', carrito: carritoActualizado });
  } catch (error) {
    console.error('Error en la ruta POST /temporal:', error);
    res.status(400).json({ error: error.message });
  }
});



// Vaciar el carrito temporal
router.delete('/temporal', async (req, res) => {
  try {
    req.session.carrito = [];
    res.status(200).json({ mensaje: 'Carrito temporal vaciado correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

///////////////////////////////////////////////////////////////CARRITO USUARIO/////////////////////////////////////////////////////////////////

// Obtener el carrito
router.get(
  '/:usuarioId', 
  validarCarrito.obtenerCarrito, 
  handleValidation, 
  verificarToken,
  async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const carrito = await CarritoService.obtenerCarrito(usuarioId);
    res.status(200).json(carrito);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Añadir producto al carrito
router.post(
  '/:usuarioId', 
  verificarToken,
  async (req, res) => {
  const usuarioId = parseInt(req.params.usuarioId, 10);
  const productos = req.body;

  try {
    const carrito = await CarritoService.addProductsToCart(usuarioId, productos);
    res.status(201).json(carrito);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Actualizar cantidad de un producto en el carrito
router.put(
  '/:usuarioId', 
  verificarToken,
  validarCarrito.actualizarProducto, 
  handleValidation, 
  async (req, res) => {
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
router.delete(
  '/:usuarioId/:productoId', 
  verificarToken,
  async (req, res) => {
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
router.delete(
  '/:usuarioId', 
  verificarToken,
  async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId, 10);
    const carrito = await CarritoService.clearCart(usuarioId);
    res.status(200).json({ mensaje: 'Carrito vaciado correctamente.', carrito });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
