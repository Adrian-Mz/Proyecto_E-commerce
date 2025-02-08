import { Router } from 'express';
import { ivaService } from '../services/iva.service.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';

const router = Router();

/**
 * 🔹 Actualizar el IVA de una categoría y todos sus productos
 * URL: PUT /api/iva/categoria/:categoriaId
 * Requiere autenticación y rol de Administrador.
 */
router.put('/categoria/:categoriaId', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const { ivaPorcentaje } = req.body;

    if (!ivaPorcentaje || isNaN(ivaPorcentaje)) {
      return res.status(400).json({ error: 'Debe proporcionar un IVA válido.' });
    }

    // 🔹 Convertir valores a números
    const categoriaIdInt = parseInt(categoriaId, 10);
    const nuevoIva = parseFloat(ivaPorcentaje);

    // 🔹 Llamar al servicio para actualizar el IVA
    const resultado = await ivaService.actualizarIvaCategoria(categoriaIdInt, nuevoIva);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
