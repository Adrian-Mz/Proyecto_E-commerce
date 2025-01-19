import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CategoriaData = {
  // Obtener todas las categorías
  async getAllCategorias() {
    return await prisma.categorias.findMany({
      include: {
        productos: {
          orderBy: { id: 'asc' },
        },
        promociones: {
          include: { promocion: true },
        },
      },
    });
  },

  // Obtener una categoría por ID
  async getCategoriaById(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.categorias.findUnique({
      where: { id },
      include: {
        productos: true,
        promociones: {
          include: { promocion: true },
        },
      },
    });
  },  

  // Crear una nueva categoría
  async createCategoria(data) {
    if (!data || !data.nombre || !data.descripcion) {
      throw new Error('Datos incompletos para crear las categorías');
    }
    return await prisma.categorias.create({ data });
  },

  // Actualizar una categoría
  async updateCategoria(id, data) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.categorias.update({
      where: { id },
      data,
    });
  },

  // Eliminar una categoría
  async deleteCategoria(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.categorias.delete({
      where: { id },
    });
  },
};



