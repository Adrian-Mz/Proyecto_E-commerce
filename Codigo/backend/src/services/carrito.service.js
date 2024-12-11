import { carritoData } from '../data/carrito.data.js';
import { ProductosData } from '../data/productos.data.js';

export const CarritoService = {

    async obtenerCarrito(usuarioId) {
        if (isNaN(usuarioId)) {
            throw new Error('El usuarioId debe ser un número válido');
        }

        const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
        if (!carrito) {
            throw new Error(`No se encontró un carrito para el usuario con ID ${usuarioId}`);
        }

        return carrito;
    },

    async agregarProductoAlCarrito(usuarioId, productoId, cantidad) {
        // Convertir los valores a números
        usuarioId = parseInt(usuarioId, 10);
        productoId = parseInt(productoId, 10);
        cantidad = parseInt(cantidad, 10);

        if (isNaN(usuarioId) || isNaN(productoId) || isNaN(cantidad)) {
        throw new Error('Todos los parámetros deben ser números válidos');
        }

        // Verificar que el producto existe
        const producto = await ProductosData.getProductoById(productoId);
        if (!producto) {
        throw new Error(`El producto con ID ${productoId} no existe`);
        }

        // Validar stock
        if (producto.stock < cantidad) {
        throw new Error(`Stock insuficiente. Solo quedan ${producto.stock} unidades disponibles`);
        }

        // Verificar si el usuario ya tiene un carrito
        let carrito = await carritoData.getCarritoByUsuarioId(usuarioId);

        // Si no existe, crear un nuevo carrito
        if (!carrito) {
        carrito = await carritoData.createCarrito(usuarioId);
        }

        // Agregar el producto al carrito
        const precio_unitario = parseFloat(producto.precio);
        return await carritoData.addProductoCarrito(carrito.id, productoId, cantidad, precio_unitario);
    },
};
