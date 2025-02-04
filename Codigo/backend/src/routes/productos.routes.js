import express from "express";
import { ProductosService } from "../services/productos.service.js";
import { validarProductoActualizar } from "../validations/productos.validation.js";
import { handleValidation } from "../middlewares/handleValidation.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { verificarRol } from "../middlewares/roles.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

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

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const { search, categoriaId, page, pageSize, orderBy, orderDirection } = req.query;

    const productos = await ProductosService.getAllProductos({
      search: search || "",
      categoriaId: categoriaId ? parseInt(categoriaId, 10) : null,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 0,
      orderBy: orderBy || "nombre",
      orderDirection: orderDirection || "asc",
    });

    res.status(HTTP_STATUS.OK).json(productos);
  } catch (error) {
    handleError(res, error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El ID debe ser un número válido." });
    }

    const producto = await ProductosService.getProductoById(id);
    res.status(HTTP_STATUS.OK).json(producto);
  } catch (error) {
    handleError(res, error, HTTP_STATUS.BAD_REQUEST);
  }
});

// Crear un nuevo producto (requiere autenticación y rol de Administrador)
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

      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "La imagen es obligatoria." });
      }

      const productoData = {
        ...req.body,
        imagenLocalPath: req.file.path,
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

// Actualizar un producto existente (solo Administradores)
router.put(
  "/:id",
  verificarToken,
  verificarRol(["Administrador"]),
  validarProductoActualizar,
  handleValidation,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.usuario?.id; // Extraer usuario autenticado

      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
      if (!usuarioId) {
        return res.status(400).json({ error: "Usuario no autenticado." });
      }

      const data = req.body;
      const productoActualizado = await ProductosService.updateProducto(id, data, usuarioId);

      res.status(200).json({
        message: "Producto actualizado correctamente.",
        producto: productoActualizado,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);


// Eliminar un producto (solo Administradores)
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

      await ProductosService.deleteProducto(id, usuarioId);
      res.status(HTTP_STATUS.OK).json({ message: "Producto eliminado exitosamente." });
    } catch (error) {
      handleError(res, error, HTTP_STATUS.BAD_REQUEST);
    }
  }
);

// Ruta para búsqueda de productos con autocompletado
router.get("/buscar", async (req, res, next) => {
  try {
    const { q, limit } = req.query;
    if (!q || typeof q !== "string" || q.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "El término de búsqueda es obligatorio." });
    }

    const productos = await ProductosService.buscarProductos(q.trim(), limit);
    res.status(HTTP_STATUS.OK).json(productos);
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
    next(error);
  }
});

// Obtener productos similares
router.get("/similares", async (req, res, next) => {
  try {
    const { productoId, categoriaId, marca } = req.query;

    if (!categoriaId && !marca) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Debe proporcionar una categoría o marca." });
    }

    const productosSimilares = await ProductosService.getProductosSimilares(
      parseInt(productoId, 10),
      parseInt(categoriaId, 10),
      marca
    );

    res.status(HTTP_STATUS.OK).json(productosSimilares);
  } catch (error) {
    console.error("Error en productos similares:", error.message);
    next(error);
  }
});

export default router;
