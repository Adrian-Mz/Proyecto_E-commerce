import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pedidosData = {
  async createPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, productos) {
    return prisma.pedidos.create({
      data: {
        usuario: { connect: { id: usuarioId } },
        metodoPago: { connect: { id: metodoPagoId } },
        metodoEnvio: { connect: { id: metodoEnvioId } },
        direccionEnvio,
        estado: { connect: { id: 1 } },
        total: productos.reduce((sum, { cantidad, precio_unitario }) => sum + cantidad * precio_unitario, 0),
        fechaActualizacion: new Date(),
        productos: {
          create: productos.map(({ productoId, cantidad, precio_unitario }) => ({
            producto: { connect: { id: productoId } },
            cantidad,
            precio_unitario,
          })),
        },
      },
      include: {
        productos: true,
      },
    });
  },

  async getPedidoById(pedidoId, usuarioId) {
    return prisma.pedidos.findFirst({
      where: { id: pedidoId, usuarioId },
      include: {
        productos: {
          include: { producto: true },
        },
        metodoPago: true,
        metodoEnvio: true,
        estado: true,
      },
    });
  },

  async getMetodosPago() {
    return prisma.metodo_pago.findMany();
  },

  async getMetodosEnvio() {
    return prisma.metodo_envio.findMany();
  },
};
