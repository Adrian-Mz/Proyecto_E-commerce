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
};
