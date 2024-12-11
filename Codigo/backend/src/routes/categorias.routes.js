import express from 'express';
import { CategoriaService } from '../services/categorias.service.js';

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
router.post('/', async (req, res) => {
  try {
    const nuevaCategoria = await CategoriaService.createCategoria(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar una categoría existente
router.put('/:id', async (req, res) => {
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
