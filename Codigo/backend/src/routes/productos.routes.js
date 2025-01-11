import express from 'express'; 
import { ProductosService } from '../services/productos.service.js'; 
import { validarProducto, validarProductoActualizar } from '../validations/productos.validation.js'
import { validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';
import { registrarAccion } from '../middlewares/auditoria.middleware.js';


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

// Ruta para crear un nuevo producto (solo Administradores)
router.post(
  '/',
  verificarToken, // Verifica autenticación
  verificarRol(['Administrador']), // Verifica que el usuario tenga el rol de Administrador
  validarProducto,
  handleValidation,
  registrarAccion('productos', 'creación'), // Registra la acción en la auditoría
  async (req, res) => {
    try {
      const data = req.body;
      const producto = await ProductosService.createProducto(data);
      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Ruta para actualizar un producto existente (solo Administradores)
router.put(
  '/:id',
  verificarToken,
  verificarRol(['Administrador']),
  validarProductoActualizar,
  handleValidation,
  registrarAccion('productos', 'actualización'),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = req.body;
      const producto = await ProductosService.updateProducto(id, data);
      // Devuelve el producto actualizado junto con un mensaje de confirmación
      res.status(200).json({
        message: 'Producto actualizado correctamente.',
        producto,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Ruta para eliminar un producto (solo Administradores)
router.delete(
  '/:id',
  verificarToken,
  verificarRol(['Administrador']),
  registrarAccion('productos', 'eliminación'),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await ProductosService.deleteProducto(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);



export default router; // Exporta el router para ser utilizado en el archivo principal de rutas.
