import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pedidosData = {
  // Crear un nuevo pedido
  async createPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, productos) {
    return await prisma.pedidos.create({
      data: {
        usuario: {
          connect: { id: usuarioId }, // Conectar usuario existente
        },
        metodoPago: {
          connect: { id: metodoPagoId }, // Conectar método de pago existente
        },
        metodoEnvio: {
          connect: { id: metodoEnvioId }, // Conectar método de envío existente
        },
        direccionEnvio,
        estado: {
          connect: { id: 1 }, // Estado inicial por defecto (ejemplo)
        },
        total: productos.reduce((sum, p) => sum + p.cantidad * p.precio_unitario, 0), // Calcular el total
        fechaActualizacion: new Date(), // Asigna la fecha de actualización actual
        productos: { // Crear relación con productos usando pedido_productos
          create: productos.map((p) => ({
            producto: {
              connect: { id: p.productoId }, // Conectar el producto existente
            },
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
          })),
        },
      },
      include: {
        productos: true, // Incluir productos en la respuesta para validar
      },
    });
  },

  // Obtener métodos de pago válidos
  async getMetodosPago() {
    return await prisma.metodo_pago.findMany();
  },

  // Obtener métodos de envío válidos
  async getMetodosEnvio() {
    return await prisma.metodo_envio.findMany();
  },
};
