import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const metodoEnvioData = {
  async getMetodosEnvio() {
    return await prisma.metodo_envio.findMany();
  },
};
