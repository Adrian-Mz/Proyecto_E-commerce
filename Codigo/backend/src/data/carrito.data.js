import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const carritoData = {
  // Función para obtener carrito por usuario ID
  async getCarritoByUsuarioId(usuarioId) {
    if (typeof usuarioId !== 'number') {
      throw new Error('El usuarioId debe ser un número');
    }
    return await prisma.carrito.findFirst({
      where: { usuarioId },
      include: {
        productos: {
          include: {
            producto: true,
          },
        },
      },
    });
  },

  // Función para crear un nuevo carrito
  async createCarrito(usuarioId) {
    if (typeof usuarioId !== 'number') {
      throw new Error('El usuarioId debe ser un número');
    }
    return await prisma.carrito.create({
      data: { usuarioId },
    });
  },  

  // Función para agregar un producto al carrito
  async addProductoCarrito(carritoId, productoId, cantidad, precio_unitario) {
    carritoId = parseInt(carritoId, 10);
    productoId = parseInt(productoId, 10);
    cantidad = parseInt(cantidad, 10);
    precio_unitario = parseFloat(precio_unitario);
    if (
      isNaN(carritoId) ||
      isNaN(productoId) ||
      isNaN(cantidad) ||
      isNaN(precio_unitario)
    ) {
      throw new Error('Todos los parámetros deben ser números válidos');
    }
    return await prisma.carrito_productos.create({
      data: {
        carritoId,
        productoId,
        cantidad,
        precio_unitario,
      },
    });
  },

  // Función para actualizar la cantidad de un producto en el carrito
  async updateProductoInCarrito(carritoProductoId, cantidad) {
    if (typeof carritoProductoId !== 'number' || typeof cantidad !== 'number') {
      throw new Error('carritoProductoId y cantidad deben ser números');
    }
    return await prisma.carrito_productos.update({
      where: { id: carritoProductoId },
      data: { cantidad },
    });
  },

  // Función para eliminar un producto del carrito
  async removeProductoFromCarrito(carritoProductoId) {
    if (typeof carritoProductoId !== 'number') {
      throw new Error('El carritoProductoId debe ser un número');
    }
    return await prisma.carrito_productos.delete({
      where: { id: carritoProductoId },
    });
  },

  // Función para eliminar todos los productos del carrito - Limpiar carrito
  async clearCarrito(carritoId) {
    if (typeof carritoId !== 'number') {
      throw new Error('El carritoId debe ser un número');
    }
    return await prisma.carrito_productos.deleteMany({
      where: { carritoId },
    });
  },
};
