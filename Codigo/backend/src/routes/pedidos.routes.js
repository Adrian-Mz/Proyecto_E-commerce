import express from "express";
import { pedidosService } from "../services/pedidos.service.js";
import { validarCrearPedido } from "../validations/pedidos.validation.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { verificarRol } from "../middlewares/roles.middleware.js";
import { handleValidation } from "../middlewares/handleValidation.js";

const router = express.Router();

// Constantes para códigos HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Manejador centralizado de errores
const handleError = (res, error, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  console.error(error);
  res.status(statusCode).json({
    error: error.message || "Ocurrió un error inesperado.",
  });
};

// Obtener pedidos (historial, específico o todos)
router.get("/:pedidoId?", verificarToken, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const pedidoId = req.params.pedidoId ? parseInt(req.params.pedidoId, 10) : null;
    const esAdmin = req.usuario.rol === "Administrador"; // Verifica si es admin

    const pedidos = await pedidosService.obtenerPedidos({ usuarioId, pedidoId, esAdmin });
    res.status(HTTP_STATUS.OK).json({ pedidos });
  } catch (error) {
    handleError(res, error, HTTP_STATUS.BAD_REQUEST);
  }
});

// Crear un nuevo pedido (Restaurando la lógica original)
router.post(
  "/:usuarioId",
  validarCrearPedido,
  handleValidation,
  async (req, res) => {
    try {
      const usuarioId = parseInt(req.params.usuarioId, 10);
      const { direccionEnvio, metodoPagoId, metodoEnvioId, detallesPago } = req.body;

      if (isNaN(usuarioId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID del usuario debe ser un número válido." });
      }

      console.log("Recibiendo datos para crear pedido:", req.body);
      const resultado = await pedidosService.crearPedido(
        usuarioId,
        direccionEnvio,
        metodoPagoId,
        metodoEnvioId,
        detallesPago
      );

      res.status(HTTP_STATUS.CREATED).json(resultado);
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Eliminar un pedido con manejo de errores
router.delete("/:pedidoId", verificarToken, verificarRol(["Administrador"]), async (req, res) => {
  try {
    const pedidoId = parseInt(req.params.pedidoId, 10);
    if (isNaN(pedidoId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID del pedido debe ser un número válido." });
    }

    await pedidosService.eliminarPedido(pedidoId);
    res.status(HTTP_STATUS.OK).json({ message: "Pedido eliminado exitosamente." });
  } catch (error) {
    handleError(res, error, HTTP_STATUS.BAD_REQUEST);
  }
});

// Obtener estado del pedido y fecha estimada de entrega
router.get("/:pedidoId/estado", verificarToken, async (req, res) => {
  try {
    const pedidoId = parseInt(req.params.pedidoId, 10);
    if (isNaN(pedidoId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID del pedido debe ser un número válido." });
    }

    const estadoPedido = await pedidosService.obtenerEstadoPedido(pedidoId);
    res.status(HTTP_STATUS.OK).json(estadoPedido);
  } catch (error) {
    handleError(res, error, HTTP_STATUS.BAD_REQUEST);
  }
});

export default router;
