import express from 'express';
import { CategoriaService } from '../services/categorias.service.js';
import { validarCategoria } from '../validations/categorias.validation.js';
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
router.post('/', validarCategoria, handleValidation, async (req, res) => {
  try {
    const nuevaCategoria = await CategoriaService.createCategoria(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una categoría existente
router.put('/:id', validarCategoria, handleValidation, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const categoriaActualizada = await CategoriaService.updateCategoria(id, req.body);
    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await CategoriaService.deleteCategoria(id);
    res.status(204).send(); // No devuelve contenido
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
