import { ProductosData } from '../data/productos.data.js';
import { subirImagenCloudinary } from '../utils/cloudinary.js';
import { buscarProductosMercadoLibre } from '../utils/mercadoLibre.js';
import {pedidosData} from '../data/pedidos.data.js';
import {carritoData} from '../data/carrito.data.js';
import { auditoriaService } from '../services/auditoria.service.js';

export const ProductosService = {
  // Obtener todos los productos
  async getAllProductos(params) {
    try {
      const { search, categoriaId, page, pageSize, orderBy, orderDirection } = params;

      const validPage = Math.max(parseInt(page, 10) || 1, 1);
      const validPageSize = parseInt(pageSize, 10) || 0;
      const validOrderBy = ["nombre", "precio", "createdAt"].includes(orderBy) ? orderBy : "nombre";
      const validOrderDirection = ["asc", "desc"].includes(orderDirection?.toLowerCase()) ? orderDirection: "asc";

      const { productos, total } = await ProductosData.getAllProductos({
        search,
        categoriaId,
        page: validPage,
        pageSize: validPageSize,
        orderBy: validOrderBy,
        orderDirection: validOrderDirection,
      });

      // Productos con promocines activas
      // Calcular el precio con promoción para cada producto
      const productosConPromocion = productos.map((producto) => {
        let precioConPromocion = producto.precio;
        let mensajePromocion = "Producto sin promoción";

        if (
          producto.promocion &&
          this.esPromocionActiva(producto.promocion.fechaInicio, producto.promocion.fechaFin)
        ) {
          const descuento = parseFloat(producto.promocion.descuento) / 100;
          precioConPromocion =
            parseFloat(producto.precio) - parseFloat(producto.precio) * descuento;
          mensajePromocion = `Promoción activa: ${producto.promocion.nombre} (${producto.promocion.descuento}% de descuento)`;
        }

        return {
          ...producto,
          precioConPromocion: precioConPromocion.toFixed(2),
          mensajePromocion,
        };
      });

      return {
        productos: productosConPromocion,
        total,
        currentPage: validPage,
        totalPages: validPageSize > 0 ? Math.ceil(total / validPageSize) : 1,
      };
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  },


  // Obtener un producto por ID
  async getProductoById(id) {
    try {
      validarId(id);
      const producto = await ProductosData.getProductoById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      // Inicializar variables para el precio con promoción
      let precioConPromocion = parseFloat(producto.precio);
      let mensajePromocion = "Sin promoción activa para este producto.";

      // Validar si la promoción está activa
      if (
        producto.promocion &&
        this.esPromocionActiva(producto.promocion.fechaInicio, producto.promocion.fechaFin)
      ) {
        const descuento = parseFloat(producto.promocion.descuento) / 100;
        precioConPromocion = precioConPromocion - precioConPromocion * descuento;
        mensajePromocion = `Promoción activa: ${producto.promocion.nombre} (${producto.promocion.descuento}% de descuento).`;
      } else if (producto.promocion) {
        mensajePromocion = "La promoción de este producto ha terminado.";
      }

      // Retornar el producto con detalles de promoción
      return {
        ...producto,
        precioConPromocion: precioConPromocion.toFixed(2),
        mensajePromocion,
      };
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  },

  esPromocionActiva(fechaInicio, fechaFin) {
    const ahora = new Date();
    return (
      (!fechaInicio || new Date(fechaInicio) <= ahora) &&
      (!fechaFin || new Date(fechaFin) >= ahora)
    );
  },

  // Crear un nuevo producto con auditoría
  async createProducto(data, usuarioId) {
    try {
      console.log("Datos recibidos:", data);

      if (!data || !data.nombre || !data.descripcion) {
        throw new Error("El nombre y la descripción son obligatorios");
      }

      data.precio = parseFloat(data.precio);
      data.stock = parseInt(data.stock, 10);
      data.categoriaId = parseInt(data.categoriaId, 10);
      data.promocionId = data.promocionId ? parseInt(data.promocionId, 10) : null;
      data.ivaPorcentaje = data.ivaPorcentaje ? parseFloat(data.ivaPorcentaje) : 0;

      const precioConIVA = data.precio + (data.precio * (data.ivaPorcentaje / 100));
      data.precio = parseFloat(precioConIVA.toFixed(2));

      let imageUrl;
      if (data.imagenLocalPath) {
        imageUrl = await subirImagenCloudinary(data.imagenLocalPath, "productos");
      } else {
        const productoML = await buscarProductosMercadoLibre(data.nombre);
        if (productoML) {
          imageUrl = productoML.imagen;
        } else {
          throw new Error("No se encontró una imagen adecuada para el producto");
        }
      }
      data.imagen = imageUrl;

      const nuevoProducto = await ProductosData.createProducto(data);

      await auditoriaService.registrarEvento(
        usuarioId,
        "productos",
        "CREAR",
        nuevoProducto
      );

      return nuevoProducto;
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  },     

  // Actualizar un producto por ID
  async updateProducto(id, data) {
    try {
        validarId(id);
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Los datos para actualizar el producto no pueden estar vacíos');
        }

        // Obtener producto actual
        const productoActual = await ProductosData.getProductoById(id);
        if (!productoActual) {
            throw new Error('Producto no encontrado');
        }

        let precioFinal = parseFloat(productoActual.precio); // Mantiene el precio actual si no se cambia
        let ivaFinal = productoActual.ivaPorcentaje; // Mantiene el IVA actual si no se cambia

        // Si se actualiza solo el precio, recalcularlo con el IVA actual
        if (data.precio !== undefined && data.ivaPorcentaje === undefined) {
            precioFinal = parseFloat(data.precio) * (1 + (ivaFinal / 100));
        }

        // Si se actualiza el IVA, recalcular el precio con el nuevo IVA
        if (data.ivaPorcentaje !== undefined) {
            ivaFinal = parseFloat(data.ivaPorcentaje);
            const precioBase = data.precio !== undefined ? parseFloat(data.precio) : productoActual.precio / (1 + (productoActual.ivaPorcentaje / 100)); // Quitar IVA anterior
            precioFinal = precioBase * (1 + (ivaFinal / 100)); // Aplicar nuevo IVA
        }

        precioFinal = parseFloat(precioFinal.toFixed(2));

        // Construir objeto de actualización
        const dataActualizada = {
            ...data,
            precio: precioFinal,
            ivaPorcentaje: ivaFinal
        };

        // Guardar cambios en la base de datos
        return await ProductosData.updateProducto(id, dataActualizada);
    } catch (error) {
        throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  },

  // Eliminar un producto con auditoría
  async deleteProducto(id, usuarioId) {
    try {
      validarId(id);
      const productoEliminado = await ProductosData.getProductoById(id);
      if (!productoEliminado) {
        throw new Error("Producto no encontrado");
      }

      const pedidosRelacionados = await pedidosData.getPedidosByProductoId(id);
      if (pedidosRelacionados.length > 0) {
        throw new Error(`No se puede eliminar el producto. Está en ${pedidosRelacionados.length} pedido(s).`);
      }

      const carritosRelacionados = await carritoData.getCarritosByProductoId(id);
      if (carritosRelacionados.length > 0) {
        throw new Error(`No se puede eliminar el producto. Está en ${carritosRelacionados.length} carrito(s).`);
      }

      await ProductosData.deleteProducto(id);

      await auditoriaService.registrarEvento(
        usuarioId,
        "productos",
        "ELIMINAR",
        productoEliminado
      );

      return { message: "Producto eliminado exitosamente" };
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  },

  async buscarProductos(termino, limit = 5) {
    if (!termino || termino.length < 2) {
      throw new Error("El término de búsqueda debe tener al menos 2 caracteres.");
    }
  
    return await ProductosData.buscarProductosPorNombreOCategoria(termino, limit);
  }
  
};

function validarId(id) {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new Error('El ID debe ser un número válido');
  }
}