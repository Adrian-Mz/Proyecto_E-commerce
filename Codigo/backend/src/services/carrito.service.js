import { carritoData } from '../data/carrito.data.js';
import { ProductosData } from '../data/productos.data.js';

export const CarritoService = {
  // Obtener el carrito de un usuario
   async obtenerCarrito(usuarioId) {
    const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito) {
      throw new Error(`No se encontró un carrito para el usuario con ID ${usuarioId}`);
    }

    const productos = carrito.productos || [];
    let promocionesActivas = true;
    const detallesPromociones = [];

    // Recorre los productos del carrito para generar mensajes detallados
    const productosConDetalles = productos.map((item) => {
      const mensajePromocion = item.precio_unitario < parseFloat(item.producto.precio)
        ? `Descuento aplicado: Precio original ${item.producto.precio}, Precio con descuento ${item.precio_unitario}.`
        : "Sin descuento aplicado.";

      if (item.precio_unitario === parseFloat(item.producto.precio) && item.producto.promocion) {
        promocionesActivas = false; // Al menos una promoción no está activa
        detallesPromociones.push({
          producto: item.producto.nombre,
          mensaje: "La promoción de este producto ha terminado.",
        });
      } else {
        detallesPromociones.push({
          producto: item.producto.nombre,
          mensaje: mensajePromocion,
        });
      }

      return {
        ...item,
        mensajePromocion,
      };
    });

    // Calcular el total del carrito
    const total = productosConDetalles.reduce(
      (sum, item) => sum + item.cantidad * item.precio_unitario,
      0
    );

    const mensajePromocionGeneral = promocionesActivas
      ? "Todas las promociones activas han sido aplicadas."
      : "Algunas promociones han terminado. Revisa los detalles de los productos.";

    return {
      ...carrito,
      productos: productosConDetalles,
      total: total.toFixed(2),
      mensajePromocionGeneral,
      detallesPromociones,
    };
  },

  // Verificar si la promoción está activa
  esPromocionActiva(fechaInicio, fechaFin) {
    const ahora = new Date();
    return (
      (!fechaInicio || new Date(fechaInicio) <= ahora) &&
      (!fechaFin || new Date(fechaFin) >= ahora)
    );
  },

  // Agregar productos al carrito de un usuario
  async addProductsToCart(usuarioId, productos) {
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error('Debes enviar un array de productos.');
    }

    let carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito) {
      carrito = await carritoData.createCarrito(usuarioId);
      carrito.productos = []; // Inicializar productos como un array vacío
    }

    for (const { productoId, cantidad } of productos) {
      const producto = await ProductosData.getProductoById(productoId);
      if (!producto) {
        throw new Error(`El producto con ID ${productoId} no existe.`);
      }

      if (producto.stock < cantidad) {
        throw new Error(
          `Stock insuficiente para el producto con ID ${productoId}. Disponible: ${producto.stock}.`
        );
      }

      // Calcula el precio con descuento si la promoción está activa
      let precio_unitario = parseFloat(producto.precio); // Precio original
      if (
        producto.promocion &&
        this.esPromocionActiva(producto.promocion.fechaInicio, producto.promocion.fechaFin)
      ) {
        const descuento = parseFloat(producto.promocion.descuento) / 100;
        precio_unitario = precio_unitario - precio_unitario * descuento; // Aplicar descuento
      }

      // Validar que productos esté inicializado como un array
      const productosEnCarrito = carrito.productos || [];
      const productoEnCarrito = productosEnCarrito.find((p) => p.productoId === productoId);

      if (productoEnCarrito) {
        const nuevaCantidad = productoEnCarrito.cantidad + cantidad;

        if (producto.stock < nuevaCantidad) {
          throw new Error(
            `Stock insuficiente para el producto con ID ${productoId}. Disponible: ${producto.stock}.`
          );
        }

        await carritoData.updateProductoInCarrito(
          productoEnCarrito.id,
          nuevaCantidad,
          precio_unitario
        );
      } else {
        await carritoData.addProductoCarrito(carrito.id, productoId, cantidad, precio_unitario);
      }
    }

    return carritoData.getCarritoByUsuarioId(usuarioId);
  },

  // Actualizar la cantidad de un producto en el carrito
  async updateProductInCart(usuarioId, productoId, cantidad) {
    usuarioId = parseInt(usuarioId, 10);
    productoId = parseInt(productoId, 10);
    cantidad = parseInt(cantidad, 10);

    if (isNaN(usuarioId) || isNaN(productoId) || isNaN(cantidad)) {
      throw new Error('Todos los parámetros deben ser números válidos.');
    }
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0.');
    }

    const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito || !carrito.productos) {
      throw new Error(`No se encontró un carrito para el usuario con ID ${usuarioId}.`);
    }

    const productoEnCarrito = carrito.productos.find((p) => p.productoId === productoId);
    if (!productoEnCarrito) {
      throw new Error(`El producto con ID ${productoId} no está en el carrito.`);
    }

    const producto = await ProductosData.getProductoById(productoId);
    if (!producto) {
      throw new Error(`El producto con ID ${productoId} no existe.`);
    }
    if (producto.stock < cantidad) {
      throw new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles.`);
    }

    const precio_unitario = parseFloat(producto.precio);
    await carritoData.updateProductoInCarrito(productoEnCarrito.id, cantidad, precio_unitario);

    const totalCarrito = await carritoData.calcularTotalCarrito(carrito.id);
    return { mensaje: 'Cantidad actualizada correctamente', total: totalCarrito };
  },

  // Eliminar un producto del carrito
  async removeProductFromCart(userId, productId) {
    const carrito = await carritoData.getCarritoByUsuarioId(userId);
    if (!carrito || !carrito.productos) {
      throw new Error(`No se encontró un carrito para el usuario con ID ${userId}.`);
    }

    const productInCart = carrito.productos.find((p) => p.productoId === productId);
    if (!productInCart) {
      throw new Error(`El producto con ID ${productId} no está en el carrito.`);
    }

    return await carritoData.removeProductoFromCarrito(productInCart.id);
  },

  // Vaciar el carrito de un usuario
  async clearCart(userId) {
    const cart = await carritoData.getCarritoByUsuarioId(userId);
    if (!cart) {
      throw new Error(`No se encontró un carrito para el usuario con ID ${userId}`);
    }

    return await carritoData.clearCarrito(cart.id);
  },
};
