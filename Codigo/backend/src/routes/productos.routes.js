import express from 'express'; 
import { ProductosService } from '../services/productos.service.js'; 
import { validarProducto } from '../validations/productos.validation.js'
import { validationResult } from 'express-validator';

const router = express.Router(); 


// Middleware para manejar errores de validación
const handleValidation = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};




// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { search, categoriaId, page, pageSize } = req.query;

    const productos = await ProductosService.getAllProductos({
      search,
      categoriaId: categoriaId ? parseInt(categoriaId, 10) : null,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 10,
    });

    res.status(200).json(productos);
  } catch (error) {
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
router.post('/', validarProducto, handleValidation, async (req, res) => {
  try {
    const data = req.body;
    const producto = await ProductosService.createProducto(data);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para actualizar un producto existente por su ID
router.put('/:id', validarProducto, handleValidation, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    const producto = await ProductosService.updateProducto(id, data);
    res.status(200).json(producto);
  } catch (error) {
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
