import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ProductosData = {
  // Obtener todos los productos
  async getAllProductos() {
    return await prisma.productos.findMany({
      include: {
        categoria: true,
        promocion: true,
      },
    });
  },

  // Obtener un producto por ID
  async getProductoById(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.productos.findUnique({
      where: { id },
      include: {
        categoria: true,
        promocion: true,
      },
    });
  },

  // Crear un nuevo producto
  async createProducto(data) {
    if (
      !data ||
      !data.nombre ||
      !data.descripcion ||
      typeof data.precio !== 'number' ||
      typeof data.stock !== 'number' ||
      !data.categoriaId
    ) {
      throw new Error(
        'Datos incompletos o inválidos para crear el producto'
      );
    }
    return await prisma.productos.create({ data });
  },

  // Actualizar un producto
  async updateProducto(id, data) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.productos.update({
      where: { id },
      data,
    });
  },

  // Eliminar un producto
  async deleteProducto(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.productos.delete({
      where: { id },
    });
  },
};
