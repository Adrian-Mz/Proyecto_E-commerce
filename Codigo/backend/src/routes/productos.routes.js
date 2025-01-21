import express from 'express'; 
import { ProductosService } from '../services/productos.service.js'; 
import { validarProducto, validarProductoActualizar } from '../validations/productos.validation.js'
import { handleValidation } from '../middlewares/handleValidation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';
import { registrarAccion } from '../middlewares/auditoria.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { subirImagenCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';


const router = express.Router(); 

// Ruta para buscar un productos
router.get('/buscar', async (req, res, next) => {
  try {
    const { q } = req.query; // Captura el parámetro de búsqueda
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'El término de búsqueda es obligatorio.' });
    }

    // Llama al servicio para buscar productos
    const productos = await ProductosService.buscarProductos(q.trim());
    res.status(200).json(productos);
  } catch (error) {
    console.log('Error en la búsqueda:', error.message);
    next(error);
  }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { search, categoriaId, page, pageSize, orderBy, orderDirection } = req.query;

    const productos = await ProductosService.getAllProductos({
      search: search || "",
      categoriaId: categoriaId ? parseInt(categoriaId, 10) : null,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 0,
      orderBy: orderBy || "nombre", // Ordena por nombre por defecto
      orderDirection: orderDirection || "asc", // Dirección ascendente por defecto
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


// Ruta para crear un producto con imagen
router.post(
  '/',
  upload.single('imagen'), // El nombre debe coincidir con el del FormData
  async (req, res) => {
    console.log('Archivo recibido:', req.file); // Verifica si el archivo llegó
    console.log('Datos del cuerpo:', req.body); // Verifica los demás datos

    try {
      const productoData = req.body;
      const filePath = req.file?.path;

      if (filePath) {
        const imageUrl = await subirImagenCloudinary(filePath, 'productos');
        productoData.imagen = imageUrl;
        fs.unlinkSync(filePath); // Eliminar archivo local
      }

      const nuevoProducto = await ProductosService.createProducto(productoData);
      res.status(201).json({ message: 'Producto creado exitosamente.', producto: nuevoProducto });
    } catch (error) {
      console.error("Error en el backend:", error.message);
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
