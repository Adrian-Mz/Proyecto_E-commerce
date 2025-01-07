import { carritoData } from '../data/carrito.data.js';
import { ProductosData } from '../data/productos.data.js';

export const CarritoService = {

    // Obtener el carrito de un usuario
    async obtenerCarrito(usuarioId) {
      const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
      if (!carrito) {
        throw new Error(`No se encontró un carrito para el usuario con ID ${usuarioId}`);
      }
    
      // Calcular el total de todos los productos en el carrito
      const total = carrito.productos.reduce((sum, item) => {
        return sum + item.cantidad * parseFloat(item.precio_unitario);
      }, 0);
    
      // Devolver el carrito junto con el total
      return { ...carrito, total };
    },

    // Añadir producto al carrito
    async addProductToCart(usuarioId, productoId, cantidad) {
      const producto = await ProductosData.getProductoById(productoId);
      if (!producto) {
        throw new Error(`El producto con ID ${productoId} no existe.`);
      }
    
      if (producto.stock < cantidad) {
        throw new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles.`);
      }
    
      let carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
      if (!carrito) {
        carrito = await carritoData.createCarrito(usuarioId);
      }
    
      if (!carrito.productos) {
        carrito.productos = []; // Asegurarse de que carrito.productos esté inicializado como un array
      }
    
      const productoEnCarrito = carrito.productos.find((p) => p.productoId === productoId);
      if (productoEnCarrito) {
        const nuevaCantidad = productoEnCarrito.cantidad + cantidad;
    
        if (producto.stock < nuevaCantidad) {
          throw new Error(
            `Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles.`
          );
        }
    
        return await carritoData.updateProductoInCarrito(
          productoEnCarrito.id,
          nuevaCantidad,
          parseFloat(producto.precio)
        );
      } else {
        const precio_unitario = parseFloat(producto.precio);
        return await carritoData.addProductoCarrito(carrito.id, productoId, cantidad, precio_unitario);
      }
    },
    


    // Actualizar cantidad de un producto en el carrito
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
    
      
      
    // Eliminar producto del carrito
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
    

    // Vaciar el carrito
    async clearCart(userId) {
        const cart = await carritoData.getCarritoByUsuarioId(userId);
        if (!cart) {
        throw new Error(`No se encontró un carrito para el usuario con ID ${userId}`);
        }

        return await carritoData.clearCarrito(cart.id);
    },
};
