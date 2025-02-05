import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const devolucionesData = {
  
  // Registrar una nueva devolución
  async createDevolucion({ pedidoId, motivo, estadoId }) {
    return await prisma.devoluciones.create({
      data: {
        pedidoId,
        motivo,
        estadoId,
        fechaDevolucion: new Date(),
      },
    });
  },

  // Obtener todas las devoluciones
  async getAllDevoluciones() {
    return await prisma.devoluciones.findMany({
      include: {
        pedido: true,
        estado: true,
        productos: {
          include: {
            producto: true,
            estado: true,
          },
        },
      },
    });
  },

  // Obtener una devolución por ID
  async getDevolucionById(devolucionId) {
    return await prisma.devoluciones.findUnique({
      where: { id: devolucionId },
      include: {
        pedido: true,
        estado: true,
        productos: {
          include: {
            producto: true,
            estado: true,
          },
        },
      },
    });
  },

  // Obtener devoluciones por pedido ID
  async getDevolucionesByPedidoId(pedidoId) {
    return await prisma.devoluciones.findMany({
      where: { pedidoId },
      include: {
        estado: true,
        productos: {
          include: {
            producto: true,
            estado: true,
          },
        },
      },
    });
  },

  // Obtener productos de una devolución específica
  async getProductosByDevolucionId(devolucionId) {
    return await prisma.devolucion_productos.findMany({
      where: { devolucionId },
      include: {
        producto: true,
        estado: true,
      },
    });
  },

  // Obtener un producto específico dentro de una devolución
  async getProductoDevolucion(devolucionId, productoId) {
    return await prisma.devolucion_productos.findUnique({
      where: {
        devolucionId_productoId: {
          devolucionId,
          productoId,
        },
      },
      include: {
        producto: true,
        estado: true,
      },
    });
  },

  // ✅ NUEVO: Verificar si un producto de un pedido ya fue devuelto
  async getProductoDevolucionByPedido(pedidoId, productoId) {
    return await prisma.devolucion_productos.findFirst({
      where: {
        productoId,
        devolucion: {
          pedidoId, // Busca dentro de la devolución que pertenece al pedido
        },
      },
      include: {
        devolucion: true,
        estado: true,
      },
    });
  },

  // Agregar un producto a una devolución
  async agregarProductoADevolucion(data) {
    return await prisma.devolucion_productos.create({
      data,
      include: {
        producto: true,
        estado: true,
      },
    });
  },

  // Actualizar el estado de una devolución
  async updateDevolucion(devolucionId, updateData) {
    return await prisma.devoluciones.update({
      where: { id: devolucionId },
      data: updateData,
    });
  },

  // Actualizar el estado de un producto dentro de una devolución
  async updateEstadoProductoDevolucion(devolucionId, productoId, nuevoEstadoId) {
    return await prisma.devolucion_productos.update({
      where: {
        devolucionId_productoId: {
          devolucionId,
          productoId,
        },
      },
      data: { estadoId: nuevoEstadoId },
    });
  },

  // Contar productos pendientes dentro de una devolución
  async countProductosPendientesDevolucion(devolucionId) {
    return await prisma.devolucion_productos.count({
        where: {
            devolucionId,
            estadoId: 9, // Estado "Producto Pendiente"
        },
    });
  }

};
