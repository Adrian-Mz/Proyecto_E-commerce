import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const estadoData = {
  // Obtener todos los estados
  async getAllEstados() {
    return await prisma.estado.findMany();
  },

  // Obtener estado por ID
  async getEstadoById(id) {
    return await prisma.estado.findUnique({
      where: { id },
    });
  },

  // Obtener historial de cambios de estado de un pedido
  async getHistorialEstadosPedido(pedidoId) {
    return await prisma.historial_estado_pedidos.findMany({
      where: { pedidoId },
      include: {
        estado: true, // Trae los datos del estado
      },
      orderBy: {
        fechaCambio: "asc", // Orden cronológico de cambios
      },
    });
  },
  
};
