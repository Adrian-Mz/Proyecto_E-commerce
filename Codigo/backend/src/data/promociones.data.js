import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const promocionesData = {
  // Obtener todas las promociones
  async getAllPromociones() {
    return await prisma.promociones.findMany({
      include: { categoria: true }, // Incluye la categoría relacionada
    });
  },

  // Crear una nueva promoción
  async createPromocion(datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categoriaId } = datosPromocion;
    return await prisma.promociones.create({
      data: { nombre, descripcion, descuento, fechaInicio, fechaFin, categoriaId },
    });
  },

  // Actualizar una promoción existente
  async updatePromocion(promocionId, datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categoriaId } = datosPromocion;
    return await prisma.promociones.update({
      where: { id: promocionId },
      data: { nombre, descripcion, descuento, fechaInicio, fechaFin, categoriaId },
    });
  },

  // Eliminar una promoción
  async deletePromocion(promocionId) {
    return await prisma.promociones.delete({
      where: { id: promocionId },
    });
  },

  // Verificar si una categoría existe
  async getCategoriaById(categoriaId) {
    return await prisma.categorias.findUnique({
      where: { id: categoriaId },
    });
  },

  // Obtener una promoción por ID
  async getPromocionById(promocionId) {
    return await prisma.promociones.findUnique({
      where: { id: promocionId },
    });
  },

  // Obtener productos por categorías
  async getProductosByCategoria(categoriaId) {
    return await prisma.productos.findMany({
      where: { categoriaId },
    });
  },
};


