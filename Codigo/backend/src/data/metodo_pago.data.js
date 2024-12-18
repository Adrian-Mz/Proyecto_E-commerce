import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const metodoPagoData = {
  async getMetodosPago() {
    return await prisma.metodo_pago.findMany();
  },
};
