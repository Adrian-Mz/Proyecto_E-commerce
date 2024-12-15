import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const carritoData = {
  // Obtener carrito por usuario ID
  async getCarritoByUsuarioId(usuarioId) {
    return await prisma.carrito.findFirst({
      where: { usuarioId },
      include: {
        productos: {
          include: { producto: true },
        },
      },
    });
  },

  // Crear un nuevo carrito
  async createCarrito(usuarioId) {
    return await prisma.carrito.create({
      data: { usuarioId },
    });
  },

  // Agregar un producto al carrito
  async addProductoCarrito(carritoId, productoId, cantidad, precio_unitario) {
    return await prisma.carrito_productos.create({
      data: {
        carritoId,
        productoId,
        cantidad,
        precio_unitario,
      },
    });
  },

  // Actualizar cantidad de un producto en el carrito
  async updateProductoInCarrito(carritoProductoId, cantidad) {
    return await prisma.carrito_productos.update({
      where: { id: carritoProductoId },
      data: { cantidad },
    });
  },

  // Eliminar un producto del carrito
  async removeProductoFromCarrito(carritoProductoId) {
    return await prisma.carrito_productos.delete({
      where: { id: carritoProductoId },
    });
  },

  // Limpiar carrito (eliminar todos los productos)
  async clearCarrito(carritoId) {
    return await prisma.carrito_productos.deleteMany({
      where: { carritoId },
    });
  },

  // Función para calcular el total del carrito
  async calcularTotalCarrito(carritoId) {
    return await prisma.carrito_productos.aggregate({
      where: { carritoId },
      _sum: {
        cantidad: true,
        precio_unitario: true,
      },
    });
  }

};
