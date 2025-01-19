import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const devolucionesData = {
  
  // Registrar una nueva devolución
  async createDevolucion(data) {
    return await prisma.devoluciones.create({
      data,
    });
  },
  
  // Obtener todas las devoluciones
  async getAllDevoluciones() {
    return await prisma.devoluciones.findMany({
      include: {
        pedido: true, // Incluye información del pedido asociado
        estado: true, // Incluye información del estado actual
      },
    });
  },

  // Obtener una devolución por ID
  async getDevolucionById(devolucionId) {
    return await prisma.devoluciones.findUnique({
      where: { id: devolucionId },
      include: {
        pedido: true, // Incluye información del pedido asociado
        estado: true, // Incluye información del estado actual
      },
    });
  },

  // Registrar una nueva devolución
  async createDevolucion(data) {
    return await prisma.devoluciones.create({
      data,
    });
  },

  // Actualizar el estado de una devolución
  async updateDevolucion(devolucionId, updateData) {
    return await prisma.devoluciones.update({
      where: { id: devolucionId },
      data: updateData,
    });
  },

  // Obtener devoluciones por pedido ID
  async getDevolucionesByPedidoId(pedidoId) {
    return await prisma.devoluciones.findMany({
      where: { pedidoId },
      include: {
        estado: true,
      },
    });
  },
};
