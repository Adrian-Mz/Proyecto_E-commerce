import express from 'express';
import { devolucionesService } from '../services/devoluciones.service.js';
import { verificarToken} from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';

const router = express.Router();

// Obtener todas las devoluciones
router.get('/', async (req, res) => {
  try {
    const devoluciones = await devolucionesService.obtenerTodasLasDevoluciones();
    res.status(200).json(devoluciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una devolución por ID
router.get('/:devolucionId', async (req, res) => {
    const { devolucionId } = req.params;
  
    try {
      const devolucion = await devolucionesService.obtenerDevolucionPorId(parseInt(devolucionId, 10));
      if (!devolucion) {
        return res.status(404).json({ mensaje: `No se encontró una devolución con el ID ${devolucionId}.` });
      }
  
      res.status(200).json(devolucion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Registrar una solicitud de devolución
router.post('/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  const { motivo } = req.body;

  try {
    const devolucion = await devolucionesService.registrarDevolucion(parseInt(pedidoId, 10), motivo);
    res.status(201).json({ mensaje: 'Devolución registrada correctamente.', devolucion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar el estado de una devolución
// Ruta para actualizar el estado de una devolución (solo Administradores)
router.put(
  '/:devolucionId',
  verificarToken, // Verifica si el usuario está autenticado
  verificarRol(['Administrador']), // Permite solo al rol de Administrador
  async (req, res) => {
    const { devolucionId } = req.params;
    const { estado } = req.body;

    try {
      // Asegúrate de que el estado sea un número válido
      if (!Number.isInteger(parseInt(estado, 10))) {
        return res.status(400).json({ error: 'El estado debe ser un número válido.' });
      }

      // Llama al servicio para actualizar el estado de la devolución
      const devolucionActualizada = await devolucionesService.actualizarEstadoDevolucion(
        parseInt(devolucionId, 10),
        parseInt(estado, 10),
        req.usuario.correo // Extrae el correo del token
      );

      res.status(200).json({
        mensaje: 'Estado de la devolución actualizado correctamente.',
        devolucion: devolucionActualizada,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);


export default router;
