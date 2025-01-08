import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const promocionesData = {
  // Obtener todas las promociones
  async getAllPromociones() {
    return await prisma.promociones.findMany();
  },

  // Crear una nueva promoción
  async createPromocion(datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin } = datosPromocion;
    return await prisma.promociones.create({
      data: { nombre, descripcion, descuento, fechaInicio, fechaFin },
    });
  },

  // Actualizar una promoción existente
  async updatePromocion(promocionId, datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin } = datosPromocion;
    return await prisma.promociones.update({
      where: { id: promocionId },
      data: { nombre, descripcion, descuento, fechaInicio, fechaFin },
    });
  },

  // Eliminar una promoción
  async deletePromocion(promocionId) {
    return await prisma.promociones.delete({
      where: { id: promocionId },
    });
  },

  // Obtener una promoción por ID
  async getPromocionById(promocionId) {
    return await prisma.promociones.findUnique({
      where: { id: promocionId },
    });
  },
};
