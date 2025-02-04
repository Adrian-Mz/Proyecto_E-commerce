import express from "express";
import { ProductosService } from "../services/productos.service.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { verificarRol } from "../middlewares/roles.middleware.js";
import { handleValidation } from "../middlewares/handleValidation.js";
import { validarProductoActualizar } from "../validations/productos.validation.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const handleError = (res, error, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
  console.error(error);
  res.status(statusCode).json({
    error: error.message || "Ocurrió un error inesperado.",
  });
};

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await ProductosService.getAllProductos(req.query);
    res.status(HTTP_STATUS.OK).json(productos);
  } catch (error) {
    handleError(res, error);
  }
});

// Crear un nuevo producto con auditoría
router.post(
  "/",
  verificarToken,
  verificarRol(["Administrador"]),
  upload.single("imagen"),
  async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Usuario no autenticado." });
      }

      const productoData = {
        ...req.body,
        imagenLocalPath: req.file?.path || null,
      };

      const nuevoProducto = await ProductosService.createProducto(productoData, usuarioId);

      res.status(HTTP_STATUS.CREATED).json({
        message: "Producto creado exitosamente.",
        producto: nuevoProducto,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Actualizar un producto con auditoría
router.put(
  "/:id",
  verificarToken,
  verificarRol(["Administrador"]),
  validarProductoActualizar,
  handleValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.usuario?.id; // Obtener ID del usuario autenticado
      if (isNaN(id)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
      }

      const productoActualizado = await ProductosService.updateProducto(id, req.body, usuarioId);

      res.status(HTTP_STATUS.OK).json({
        message: "Producto actualizado correctamente.",
        producto: productoActualizado,
      });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);


// Eliminar un producto con auditoría
router.delete("/:id", verificarToken, verificarRol(["Administrador"]), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const usuarioId = req.usuario?.id;
    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
    }

    await ProductosService.deleteProducto(id, usuarioId);

    res.status(HTTP_STATUS.OK).json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
    handleError(res, error, HTTP_STATUS.BAD_REQUEST);
  }
});

export default router;
