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
    let hayPromociones = false;
    const detallesPromociones = [];
  
    const productosConDetalles = await Promise.all(
      productos.map(async (item) => {
        const producto = await ProductosData.getProductoById(item.productoId);
        const precioOriginal = parseFloat(producto.precio);
        const promocionActiva = producto.promocion
          ? this.esPromocionActiva(producto.promocion.fechaInicio, producto.promocion.fechaFin)
          : false;
  
        // Calcular el precio promocional si la promoción está activa
        let precioConPromocion = precioOriginal;
        if (promocionActiva) {
          const descuento = parseFloat(producto.promocion.descuento) / 100;
          precioConPromocion = precioOriginal - precioOriginal * descuento;
        }
  
        // Sincronizar el precio en el carrito si ha cambiado
        if (parseFloat(item.precio_unitario) !== precioConPromocion) {
          await carritoData.updateProductoInCarrito(item.id, item.cantidad, precioConPromocion);
          item.precio_unitario = precioConPromocion; // Actualizar localmente
        }
  
        let mensajePromocion = "Sin descuento aplicado.";
        if (promocionActiva) {
          mensajePromocion = `Descuento aplicado: Precio original ${precioOriginal}, Precio con descuento ${precioConPromocion}.`;
          hayPromociones = true;
        } else if (producto.promocion) {
          promocionesActivas = false;
          mensajePromocion = "La promoción de este producto ha terminado.";
        }
  
        detallesPromociones.push({
          producto: producto.nombre,
          mensaje: mensajePromocion,
        });
  
        return {
          ...item,
          mensajePromocion,
        };
      })
    );
  
    // Calcular el total del carrito
    const total = productosConDetalles.reduce(
      (sum, item) => sum + item.cantidad * parseFloat(item.precio_unitario),
      0
    );
  
    let mensajePromocionGeneral = "No hay promociones activas en este carrito.";
    if (hayPromociones) {
      mensajePromocionGeneral = promocionesActivas
        ? "Todas las promociones activas han sido aplicadas."
        : "Algunas promociones han terminado. Revisa los detalles de los productos.";
    }
  
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

  /////////////////////////////////////////////////////////////CARRITO TEMPORAL//////////////////////////////////////////////////////////////////////////////

  // Obtener el carrito temporal
  async obtenerCarritoTemporal(carrito) {
    const total = carrito.reduce(
      (sum, item) => sum + item.cantidad * parseFloat(item.precio_unitario),
      0
    );

    return {
      productos: carrito,
      total: total.toFixed(2),
    };
  },


  // Agregar productos al carrito temporal
  async agregarProductoCarritoTemporal(productos, carritoTemporal) {
    // Asegurar que carritoTemporal sea un array
    const carritoActualizado = Array.isArray(carritoTemporal) ? [...carritoTemporal] : [];
  
    for (const { productoId, cantidad } of productos) {
      // Validar el producto en la base de datos
      const producto = await ProductosData.getProductoById(parseInt(productoId, 10));
      if (!producto) {
        throw new Error(`El producto con ID ${productoId} no existe.`);
      }
  
      if (producto.stock < cantidad) {
        throw new Error(
          `Stock insuficiente para el producto con ID ${productoId}. Disponible: ${producto.stock}.`
        );
      }
  
      // Calcular el precio con descuento si la promoción está activa
      let precio_unitario = parseFloat(producto.precio);
      if (
        producto.promocion &&
        this.esPromocionActiva(producto.promocion.fechaInicio, producto.promocion.fechaFin)
      ) {
        const descuento = parseFloat(producto.promocion.descuento) / 100;
        precio_unitario = precio_unitario - precio_unitario * descuento;
      }
  
      // Buscar el producto en el carrito temporal
      const productoEnCarrito = carritoActualizado.find((p) => p.productoId === productoId);
  
      if (productoEnCarrito) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        const nuevaCantidad = productoEnCarrito.cantidad + cantidad;
  
        if (producto.stock < nuevaCantidad) {
          throw new Error(
            `Stock insuficiente para el producto con ID ${productoId}. Disponible: ${producto.stock}.`
          );
        }
  
        productoEnCarrito.cantidad = nuevaCantidad;
        productoEnCarrito.precio_unitario = precio_unitario;
      } else {
        // Si el producto no está en el carrito, lo agregamos
        carritoActualizado.push({
          productoId,
          cantidad,
          precio_unitario,
          nombre: producto.nombre, // Puedes agregar más detalles del producto si los necesitas
        });
      }
    }
  
    // Calcular el total del carrito temporal
    const total = carritoActualizado.reduce(
      (sum, item) => sum + item.cantidad * parseFloat(item.precio_unitario),
      0
    );
  
    return {
      productos: carritoActualizado,
      total: total.toFixed(2),
    };
  }

};
