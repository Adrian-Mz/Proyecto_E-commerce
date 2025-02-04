import express from "express";
import { CategoriaService } from "../services/categorias.service.js";
import { validarCategoriaParaCrear, validarCategoriaParaActualizar } from "../validations/categorias.validation.js";
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

// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await CategoriaService.getAllCategorias();
    res.status(HTTP_STATUS.OK).json(categorias);
  } catch (error) {
    handleError(res, error);
  }
});

// Obtener una categoría por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
    }

    const categoria = await CategoriaService.getCategoriaById(id);
    if (!categoria) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: `No se encontró una categoría con el ID ${id}.` });
    }

    res.status(HTTP_STATUS.OK).json(categoria);
  } catch (error) {
    handleError(res, error);
  }
});

// Crear una nueva categoría con Auditoría
router.post(
  "/",
  verificarToken,
  verificarRol(["Administrador"]),
  validarCategoriaParaCrear,
  handleValidation,
  async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
      }

      const nuevaCategoria = await CategoriaService.createCategoria(req.body, usuarioId);

      res.status(HTTP_STATUS.CREATED).json({
        message: "Categoría creada exitosamente.",
        categoria: nuevaCategoria,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Actualizar una categoría con Auditoría
router.put(
  "/:id",
  verificarToken,
  verificarRol(["Administrador"]),
  validarCategoriaParaActualizar,
  handleValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.usuario?.id;

      if (isNaN(id)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
      }
      if (!usuarioId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
      }

      const categoriaActualizada = await CategoriaService.updateCategoria(id, req.body, usuarioId);

      res.status(HTTP_STATUS.OK).json({
        message: "Categoría actualizada correctamente.",
        categoria: categoriaActualizada,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Eliminar una categoría con Auditoría
router.delete(
  "/:id",
  verificarToken,
  verificarRol(["Administrador"]),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.usuario?.id;

      if (isNaN(id)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
      }
      if (!usuarioId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
      }

      await CategoriaService.deleteCategoria(id, usuarioId);

      res.status(HTTP_STATUS.OK).json({ message: "Categoría eliminada exitosamente." });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

export default router;
