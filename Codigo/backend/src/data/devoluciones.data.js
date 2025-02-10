import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const devolucionesData = {
  
  // Registrar una nueva devolución para un producto específico
  async createDevolucion({ pedidoId, productoId, cantidad, motivo }) {
    return await prisma.devoluciones.create({
      data: {
        pedidoId,
        productoId,
        cantidad,
        motivo,
        estadoId: 5, // Estado "Devolución Pendiente"
        fechaDevolucion: new Date(),
        montoReembolsado: 0,
      },
    });
  },

  // Obtener todas las devoluciones con detalles del pedido y producto
  async getAllDevoluciones() {
    return await prisma.devoluciones.findMany({
      include: {
        pedido: {
          select: {
            usuario: {
              select: { nombre: true, apellido: true, correo: true }
            }
          }
        },
        estado: true,
        producto: {
          select: { nombre: true, precio: true }
        }
      },
      orderBy: { fechaDevolucion: 'desc' }
    });
  },

  // Obtener una devolución específica
  async getDevolucionById(devolucionId) {
    return await prisma.devoluciones.findUnique({
      where: { id: devolucionId },
      include: {
        pedido: { include: { usuario: true } },
        estado: true,
        producto: true
      },
    });
  },

  // Obtener devoluciones de un pedido
  async getDevolucionesByPedidoId(pedidoId) {
    return await prisma.devoluciones.findMany({
      where: { pedidoId },
      include: {
        estado: true,
        producto: true
      },
    });
  },

  // Obtener devoluciones de un producto dentro de un pedido
  async getDevolucionByProducto(pedidoId, productoId) {
    return await prisma.devoluciones.findFirst({
      where: {
        pedidoId,
        productoId,
      },
      include: {
        estado: true,
        producto: true
      },
    });
  },

  // Actualizar una devolución (por ejemplo, cambiar estado o monto)
  async updateDevolucion(devolucionId, updateData) {
    return await prisma.devoluciones.update({
      where: { id: devolucionId },
      data: updateData,
    });
  },

  // Obtener el nombre del estado por su ID
  async getEstadoById(estadoId) {
    return await prisma.estado.findUnique({
        where: { id: estadoId },
        select: { nombre: true }
    });
  }

};
