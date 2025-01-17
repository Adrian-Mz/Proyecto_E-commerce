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
  async updateProductoInCarrito(carritoProductoId, cantidad, precio_unitario) {
    return await prisma.carrito_productos.update({
      where: { id: carritoProductoId },
      data: { cantidad, precio_unitario },
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

  async getCarritosByProductoId(productoId) {
    return await prisma.carrito.findMany({
      where: {
        productos: {
          some: { productoId }, // Busca carritos que contengan el producto con el ID especificado
        },
      },
      include: {
        productos: {
          include: {
            producto: true, // Incluye información del producto relacionado
          },
        },
      },
    });
  },

  // Función para calcular el total del carrito
  async calcularTotalCarrito(carritoId) {
    const productosEnCarrito = await prisma.carrito_productos.findMany({
      where: { carritoId },
      select: {
        cantidad: true,
        precio_unitario: true,
      },
    });
  
    const total = productosEnCarrito.reduce(
      (acc, producto) => {
        acc.cantidad += producto.cantidad;
        acc.precio_total += producto.cantidad * producto.precio_unitario;
        return acc;
      },
      { cantidad: 0, precio_total: 0 }
    );
  
    return total;
  }  

};
