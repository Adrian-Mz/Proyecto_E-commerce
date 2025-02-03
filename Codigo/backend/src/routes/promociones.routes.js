import express from 'express';
import { promocionesService } from '../services/promociones.service.js';
import { validarCrearPromocion,validarActualizarPromocion } from '../validations/promociones.validations.js';
import { handleValidation } from '../middlewares/handleValidation.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const promocion = await promocionesService.obtenerPromocionPorId(parseInt(id, 10));
    res.status(200).json(promocion);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Obtener todas las promociones
router.get('/', async (req, res) => {
  try {
    const promociones = await promocionesService.obtenerPromociones();
    res.status(200).json(promociones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Crear una nueva promoción
router.post('/', 
  validarCrearPromocion,
  handleValidation,
  async (req, res) => {
  try {
    const nuevaPromocion = await promocionesService.crearPromocion(req.body);
    res.status(201).json({ mensaje: 'Promoción creada exitosamente.', promocion: nuevaPromocion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Asignar una promoción a todos los productos de una categoría
router.post("/asignar-categoria", async (req, res, next) => {
  try {
    const { categoriaId, promocionId } = req.body;

    if (!categoriaId || !promocionId) {
      return res.status(400).json({ error: "Se requiere categoría y promoción." });
    }

    const resultado = await promocionesService.asignarPromocionPorCategoria(categoriaId, promocionId);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

// Actualizar una promoción existente
router.put('/:promocionId', 
  validarActualizarPromocion,
  handleValidation,
  async (req, res) => {
  const { promocionId } = req.params;
  try {
    const promocionActualizada = await promocionesService.actualizarPromocion(parseInt(promocionId, 10), req.body);
    res.status(200).json({ mensaje: 'Promoción actualizada exitosamente.', promocion: promocionActualizada });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar una promoción
router.delete('/:promocionId', async (req, res) => {
  const { promocionId } = req.params;
  try {
    await promocionesService.eliminarPromocion(parseInt(promocionId, 10));
    res.status(200).json({ mensaje: 'Promoción eliminada exitosamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




export default router;
