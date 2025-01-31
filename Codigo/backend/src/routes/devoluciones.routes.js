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

// Registrar una solicitud de devolución con productos específicos
router.post('/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  const { productosDevueltos } = req.body; // Extrae la lista de productos a devolver

  try {
    const devolucion = await devolucionesService.registrarDevolucion(
      parseInt(pedidoId, 10),
      productosDevueltos // Pasa la lista de productos
    );
    res.status(201).json({ mensaje: 'Devolución registrada correctamente.', devolucion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put('/:devolucionId/producto/:productoId/estado', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  const { devolucionId, productoId } = req.params;
  console.log("🔹 Cuerpo recibido en la solicitud:", req.body); // 🛠 Depuración

  let nuevoEstadoId = req.body.nuevoEstadoId;

  try {
    if (nuevoEstadoId === undefined || nuevoEstadoId === null) {
      return res.status(400).json({ error: "El campo 'nuevoEstadoId' es obligatorio." });
    }

    nuevoEstadoId = parseInt(nuevoEstadoId, 10);
    console.log("🔹 Después de convertir:", nuevoEstadoId);

    if (isNaN(nuevoEstadoId) || !Number.isInteger(nuevoEstadoId)) {
      return res.status(400).json({ error: "El estado debe ser un número válido." });
    }

    const resultado = await devolucionesService.actualizarEstadoProductoDevuelto(
      parseInt(devolucionId, 10),
      parseInt(productoId, 10),
      nuevoEstadoId
    );

    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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
