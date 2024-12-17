import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pedidosData = {
  // Crear un nuevo pedido
  async createPedido(usuarioId, direccionEnvio, metodoPago, productos) {
    return await prisma.pedido.create({
      data: {
        usuarioId,
        direccionEnvio,
        metodoPago,
        productos: {
          create: productos.map((p) => ({
            productoId: p.productoId,
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
          })),
        },
      },
      include: { productos: true }, // Incluir los productos en la respuesta
    });
  },

  // Obtener métodos de pago válidos
  async getMetodosPago() {
    return ['tarjeta', 'paypal', 'transferencia'];
  },

  // Obtener métodos de envío válidos
  async getMetodosEnvio() {
    return ['estandar', 'express'];
  },
};
