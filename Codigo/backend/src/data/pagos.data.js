import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pagosData = {
  async registrarPago(pagoData) {
    return prisma.pagos.create({
      data: {
        pedidoId: pagoData.pedidoId,
        metodoPagoId: pagoData.metodoPagoId,
        numeroTarjeta: pagoData.numeroTarjeta,
        nombreTitular: pagoData.nombreTitular,
        fechaExpiracion: pagoData.fechaExpiracion,
        correoContacto: pagoData.correoContacto,
        telefonoContacto: pagoData.telefonoContacto,
        monto: pagoData.monto,
        fechaPago: pagoData.fechaPago,
      },
    });
  },
};
