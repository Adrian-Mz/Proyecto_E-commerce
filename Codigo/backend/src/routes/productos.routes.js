import express from 'express'; 
import { ProductosService } from '../services/productos.service.js'; 

const router = express.Router(); 

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    // Llama al servicio para obtener la lista de todos los productos.
    const productos = await ProductosService.getAllProductos();
    res.status(200).json(productos); 
  } catch (error) {
    // Maneja errores devolviendo un código 500 (error interno del servidor).
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un producto específico por su ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id); 
    const producto = await ProductosService.getProductoById(id); 
    res.status(200).json(producto); 
  } catch (error) {
    // Maneja errores devolviendo un código 400 (solicitud incorrecta).
    res.status(400).json({ error: error.message });
  }
});

// Ruta para crear un nuevo producto
router.post('/productos', async (req, res) => {
  try {
    const data = req.body; 
    const producto = await ProductosService.createProducto(data); 
    res.status(201).json(producto); 
  } catch (error) {
    // Maneja errores devolviendo un código 400 (solicitud incorrecta).
    res.status(400).json({ error: error.message });
  }
});

// Ruta para actualizar un producto existente por su ID
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id); 
    const data = req.body; 
    const producto = await ProductosService.updateProducto(id, data); 
    res.status(200).json(producto); // Devuelve el producto actualizado con un código 200 (OK).
  } catch (error) {
    // Maneja errores devolviendo un código 400 (solicitud incorrecta).
    res.status(400).json({ error: error.message });
  }
});

// Ruta para eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id); 
    await ProductosService.deleteProducto(id); 
    res.status(204).send(); 
  } catch (error) {
    // Maneja errores devolviendo un código 400 (solicitud incorrecta).
    res.status(400).json({ error: error.message });
  }
});

export default router; // Exporta el router para ser utilizado en el archivo principal de rutas.
