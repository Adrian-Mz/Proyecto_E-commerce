import express from 'express';
import { estadoService } from '../services/estado.service.js';
import { verificarToken } from "../middlewares/auth.middleware.js"; 
import { verificarRol } from "../middlewares/roles.middleware.js"; 

const router = express.Router();

// Obtener todos los estados
router.get('/', async (req, res) => {
  try {
    const estados = await estadoService.obtenerEstados();
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar el estado de un pedido
router.put(
  "/pedidos/:pedidoId/estado",
  verificarToken,
  verificarRol(["Administrador", "Empleado"]), // ✅ Solo administradores y empleados pueden cambiar estados
  async (req, res) => {
    const { pedidoId } = req.params;
    const { nuevoEstadoId } = req.body;
    const usuarioId = req.usuario?.id; // ✅ Captura el usuario autenticado

    try {
      if (!usuarioId) {
        return res.status(400).json({ error: "Usuario no autenticado." });
      }

      const pedidoActualizado = await estadoService.actualizarEstadoPedido(
        parseInt(pedidoId, 10),
        parseInt(nuevoEstadoId, 10),
        usuarioId
      );

      res.status(200).json({
        mensaje: "Estado actualizado correctamente.",
        pedido: pedidoActualizado,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Obtener historial de cambios de estado de un pedido
router.get('/pedidos/:pedidoId/historial', async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const historial = await estadoData.getHistorialEstadosPedido(parseInt(pedidoId, 10));
    res.status(200).json(historial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



export default router;
