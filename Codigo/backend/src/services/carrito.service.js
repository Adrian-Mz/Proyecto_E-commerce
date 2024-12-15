import { carritoData } from '../data/carrito.data.js';
import { ProductosData } from '../data/productos.data.js';

export const CarritoService = {

    // Obtener el carrito de un usuario
    async obtenerCarrito(usuarioId) {
        const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
        if (!carrito) {
            throw new Error(`No se encontró un carrito para el usuario con ID ${usuarioId}`);
        }
        return carrito;
    },

    // Añadir producto al carrito
    async addProductToCart(usuarioId, productoId, cantidad) {
        // Verificar que el producto existe
        const producto = await ProductosData.getProductoById(productoId);
        if (!producto) {
            throw new Error(`El producto con ID ${productoId} no existe`);
        }

        // Validar stock
        if (producto.stock < cantidad) {
            throw new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles.`);
        }

        // Verificar si el usuario ya tiene un carrito
        let carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
        if (!carrito) {
            carrito = await carritoData.createCarrito(usuarioId);
        }

        // Agregar el producto al carrito
        const precio_unitario = parseFloat(producto.precio);
        return await carritoData.addProductoCarrito(carrito.id, productoId, cantidad, precio_unitario);
    },

    // Actualizar cantidad de un producto en el carrito
    async updateProductInCart(usuarioId, productoId, cantidad) {
        usuarioId = parseInt(usuarioId, 10);
        productoId = parseInt(productoId, 10);
        cantidad = parseInt(cantidad, 10);
      
        // Verificar si los parámetros son válidos
        if (isNaN(usuarioId) || isNaN(productoId) || isNaN(cantidad)) {
          throw new Error('Todos los parámetros deben ser números válidos.');
        }
        if (cantidad <= 0) {
          throw new Error('La cantidad debe ser mayor a 0.');
        }
      
        // Obtener el carrito del usuario
        const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
        if (!carrito) {
          throw new Error(`No se encontró un carrito para el usuario con ID ${usuarioId}`);
        }
      
        // Verificar si el producto existe en el carrito
        const productoEnCarrito = carrito.productos.find((p) => p.productoId === productoId);
        if (!productoEnCarrito) {
          throw new Error(`El producto con ID ${productoId} no está en el carrito.`);
        }
      
        // Verificar stock actual del producto
        const producto = await ProductosData.getProductoById(productoId);
        if (!producto) {
          throw new Error(`El producto con ID ${productoId} no existe.`);
        }
        if (producto.stock < cantidad) {
          throw new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles.`);
        }
      
        // Actualizar la cantidad del producto en el carrito
        await carritoData.updateProductoInCarrito(productoEnCarrito.id, cantidad);
      
        // Calcular el total actualizado
        const totalCarrito = await carritoData.calcularTotalCarrito(carrito.id);
        return { mensaje: 'Cantidad actualizada correctamente', total: totalCarrito };
      },
      
      
    // Eliminar producto del carrito
    async removeProductFromCart(userId, productId) {
        const cart = await carritoData.getCarritoByUsuarioId(userId);
        if (!cart) {
        throw new Error(`No se encontró un carrito para el usuario con ID ${userId}`);
        }

        const productInCart = cart.productos.find((p) => p.productoId === productId);
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
