import express from 'express';
import { CategoriaService } from '../services/categorias.service.js';
import { validarCategoriaParaCrear, validarCategoriaParaActualizar } from '../validations/categorias.validation.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';
import { registrarAccion } from '../middlewares/auditoria.middleware.js';
import { handleValidation } from '../middlewares/handleValidation.js';

const router = express.Router();

// Constantes para códigos HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Middleware para registrar solicitudes entrantes
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Manejador centralizado de errores
const handleError = (res, error, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  console.error(error); // Registra el error en el servidor
  res.status(statusCode).json({
    error: error.message || 'Ocurrió un error inesperado.',
  });
};

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaService.getAllCategorias();
    res.status(HTTP_STATUS.OK).json(categorias);
  } catch (error) {
    handleError(res, error);
  }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'El ID debe ser un número válido.' });
    }

    const categoria = await CategoriaService.getCategoriaById(id);
    if (!categoria) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: `No se encontró una categoría con el ID ${id}.` });
    }

    res.status(HTTP_STATUS.OK).json(categoria);
  } catch (error) {
    handleError(res, error);
  }
});

// Crear una nueva categoría
router.post(
  '/',
  verificarToken, // Verifica autenticación
  verificarRol(['Administrador']), // Verifica que sea Administrador
  validarCategoriaParaCrear, // Validaciones para crear
  handleValidation,
  registrarAccion('categorias', 'creación'), // Registra la acción en auditoría
  async (req, res) => {
    try {
      const nuevaCategoria = await CategoriaService.createCategoria(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        message: 'Categoría creada exitosamente.',
        categoria: nuevaCategoria,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Actualizar una categoría existente (solo Administradores)
router.put(
  '/:id',
  verificarToken,
  verificarRol(['Administrador']),
  validarCategoriaParaActualizar, // Validaciones para actualizar
  handleValidation,
  registrarAccion('categorias', 'actualización'),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'El ID debe ser un número válido.' });
      }

      const categoriaActualizada = await CategoriaService.updateCategoria(id, req.body);
      if (!categoriaActualizada) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: `No se encontró una categoría con el ID ${id}.` });
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Categoría actualizada correctamente.',
        categoria: categoriaActualizada,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Eliminar una categoría (solo Administradores)
router.delete(
  '/:id',
  verificarToken,
  verificarRol(['Administrador']),
  registrarAccion('categorias', 'eliminación'),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'El ID debe ser un número válido.' });
      }

      await CategoriaService.deleteCategoria(id);
      res.status(HTTP_STATUS.OK).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

export default router;