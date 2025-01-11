import express from 'express';
import { CategoriaService } from '../services/categorias.service.js';
import { validarCategoriaParaCrear, validarCategoriaParaActualizar } from '../validations/categorias.validation.js';
import { validationResult } from 'express-validator';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';
import { registrarAccion } from '../middlewares/auditoria.middleware.js';
import { handleValidation } from '../middlewares/handleValidation.js';


const router = express.Router();

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await CategoriaService.getAllCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const categoria = await CategoriaService.getCategoriaById(id);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(404).json({ error: error.message });
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
      res.status(201).json({
        message: 'Categoría creada exitosamente.',
        categoria: nuevaCategoria,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      const categoriaActualizada = await CategoriaService.updateCategoria(id, req.body);
      res.status(200).json({
        message: 'Categoría actualizada correctamente.',
        categoria: categoriaActualizada,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      await CategoriaService.deleteCategoria(id);
      res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
