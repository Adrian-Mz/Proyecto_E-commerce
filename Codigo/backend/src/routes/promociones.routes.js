import express from "express";
import { promocionesService } from "../services/promociones.service.js";
import { validarCrearPromocion, validarActualizarPromocion } from "../validations/promociones.validations.js";
import { handleValidation } from "../middlewares/handleValidation.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { verificarRol } from "../middlewares/roles.middleware.js";

const router = express.Router();

// Constantes de códigos HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Manejador centralizado de errores
const handleError = (res, error, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  console.error("Error en la solicitud:", error);
  res.status(statusCode).json({
    error: error.message || "Ocurrió un error inesperado.",
  });
};

// Obtener una promoción por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
    }

    const promocion = await promocionesService.obtenerPromocionPorId(id);
    res.status(HTTP_STATUS.OK).json(promocion);
  } catch (error) {
    handleError(res, error, HTTP_STATUS.NOT_FOUND);
  }
});

// Obtener todas las promociones
router.get("/", async (req, res) => {
  try {
    const promociones = await promocionesService.obtenerPromociones();
    res.status(HTTP_STATUS.OK).json(promociones);
  } catch (error) {
    handleError(res, error);
  }
});

// Crear una nueva promoción con auditoría
router.post(
  "/",
  verificarToken,
  verificarRol(["Administrador"]),
  validarCrearPromocion,
  handleValidation,
  async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
      }

      const nuevaPromocion = await promocionesService.crearPromocion(req.body, usuarioId);

      res.status(HTTP_STATUS.CREATED).json({
        message: "Promoción creada exitosamente.",
        promocion: nuevaPromocion,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Asignar una promoción a todos los productos de una categoría
router.post("/asignar-categoria", verificarToken, verificarRol(["Administrador"]), async (req, res) => {
  try {
    const { categoriaId, promocionId } = req.body;
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
    }

    if (!categoriaId || !promocionId || isNaN(categoriaId) || isNaN(promocionId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Debe proporcionar una categoría y una promoción válidas." });
    }

    const resultado = await promocionesService.asignarPromocionPorCategoria(parseInt(categoriaId, 10), parseInt(promocionId, 10), usuarioId);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    handleError(res, error);
  }
});

// Actualizar una promoción con auditoría
router.put(
  "/:promocionId",
  verificarToken,
  verificarRol(["Administrador"]),
  validarActualizarPromocion,
  handleValidation,
  async (req, res) => {
    try {
      const promocionId = parseInt(req.params.promocionId, 10);
      const usuarioId = req.usuario?.id;

      if (!usuarioId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
      }

      if (isNaN(promocionId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID de la promoción debe ser un número válido." });
      }

      const promocionActualizada = await promocionesService.actualizarPromocion(promocionId, req.body, usuarioId);

      res.status(HTTP_STATUS.OK).json({
        message: "Promoción actualizada exitosamente.",
        promocion: promocionActualizada,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Eliminar una promoción con auditoría
router.delete("/:promocionId", verificarToken, verificarRol(["Administrador"]), async (req, res) => {
  try {
    const promocionId = parseInt(req.params.promocionId, 10);
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
    }

    if (isNaN(promocionId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID de la promoción debe ser un número válido." });
    }

    await promocionesService.eliminarPromocion(promocionId, usuarioId);

    res.status(HTTP_STATUS.OK).json({ message: "Promoción eliminada exitosamente." });
  } catch (error) {
    handleError(res, error, HTTP_STATUS.BAD_REQUEST);
  }
});

export default router;
