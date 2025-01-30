import { ProductosData } from '../data/productos.data.js';
import { subirImagenCloudinary } from '../utils/cloudinary.js';
import { buscarProductosMercadoLibre } from '../utils/mercadoLibre.js';
import {pedidosData} from '../data/pedidos.data.js';
import {carritoData} from '../data/carrito.data.js';

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

      // **Productos con promocines activas** 
      // ** Calcular el precio con promoción para cada producto**
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

  async createProducto(data) {
    try {
      console.log("Datos recibidos:", data);
  
      // Validar datos básicos
      if (!data || !data.nombre || !data.descripcion) {
        throw new Error("El nombre y la descripción son obligatorios");
      }
  
      // Convertir valores numéricos
      data.precio = parseFloat(data.precio);
      data.stock = parseInt(data.stock, 10);
      data.categoriaId = parseInt(data.categoriaId, 10);
      data.promocionId = data.promocionId ? parseInt(data.promocionId, 10) : null;
      data.ivaPorcentaje = data.ivaPorcentaje ? parseFloat(data.ivaPorcentaje): 0;
  
      console.log("Validaciones iniciales:", {
        precio: data.precio,
        stock: data.stock,
        categoriaId: data.categoriaId,
        promocionId: data.promocionId,
        ivaPorcentaje: data.ivaPorcentaje
      });
  
      if (isNaN(data.precio) || isNaN(data.stock) || isNaN(data.categoriaId) || isNaN(data.ivaPorcentaje)) {
        throw new Error("El precio, stock y categoría deben ser valores numéricos");
      }

      // Calcular el precio con IVA dinámico
      const precioConIVA = data.precio + (data.precio * (data.ivaPorcentaje / 100));
      data.precio = parseFloat(precioConIVA.toFixed(2)); // Mantener como número

      console.log("Precio con IVA calculado:", data.precio);
  
      // Validar que promoción (si se proporciona) sea un número válido
      if (data.promocionId && isNaN(data.promocionId)) {
        throw new Error("La promoción debe ser un valor numérico");
      }
  
      // Limpiar campos adicionales
      if (data.garantia) {
        data.garantia = data.garantia.trim();
      }
  
      // Procesar la imagen
      let imageUrl;
      if (data.imagenLocalPath) {
        console.log("Procesando imagen local...");
        imageUrl = await subirImagenCloudinary(data.imagenLocalPath, "productos");
      } else {
        console.log("Buscando imagen en Mercado Libre...");
        const productoML = await buscarProductosMercadoLibre(data.nombre);
        if (productoML) {
          imageUrl = productoML.imagen;
        } else {
          throw new Error("No se encontró una imagen adecuada para el producto");
        }
      }
      data.imagen = imageUrl;
  
      console.log("Imagen procesada:", imageUrl);
  
      // Enviar los datos procesados a ProductosData
      return await ProductosData.createProducto(data);
    } catch (error) {
      console.error(`Error al crear producto: ${error.message}`);
      throw new Error(`Datos incompletos o inválidos para crear el producto: ${error.message}`);
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

        // Si se cambia el IVA, recalcular el precio
        if (data.ivaPorcentaje !== undefined) {
            const precioBase = productoActual.precio / (1 + (productoActual.ivaPorcentaje / 100)); // Quitar IVA actual
            data.precio = precioBase * (1 + (data.ivaPorcentaje / 100)); // Aplicar nuevo IVA
            data.precio = parseFloat(data.precio.toFixed(2));
        }

        return await ProductosData.updateProducto(id, data);
    } catch (error) {
        throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  },

  // Eliminar un producto por ID
  async deleteProducto(id) {
    try {
      // Validar que el ID sea válido
      validarId(id);

      // Verificar si el producto está relacionado con algún pedido
      const pedidosRelacionados = await pedidosData.getPedidosByProductoId(id);
      if (pedidosRelacionados.length > 0) {
        throw new Error(
          `No se puede eliminar el producto. Está asociado a ${pedidosRelacionados.length} pedido(s).`
        );
      }

      // Verificar si el producto está relacionado con algún carrito
      const carritosRelacionados = await carritoData.getCarritosByProductoId(id);
      if (carritosRelacionados.length > 0) {
        throw new Error(
          `No se puede eliminar el producto. Está agregado en ${carritosRelacionados.length} carrito(s).`
        );
      }

      // Si no hay relaciones, eliminar el producto
      await ProductosData.deleteProducto(id);
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      // Manejar errores y lanzar una excepción
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