import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ProductosData = {
  // Obtener todos los productos
  async getAllProductos({ search = "", categoriaId = null, page = 1, pageSize = 10 }) {
    const skip = (page - 1) * pageSize;
    const where = {
      AND: [
        search ? { nombre: { contains: search, mode: "insensitive" } } : {},
        categoriaId ? { categoriaId: categoriaId } : {}
      ],
    };
  
    const productos = await prisma.productos.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        categoria: true,
        promocion: true,
      },
    });
  
    const total = await prisma.productos.count({ where });
  
    return { productos, total, page, pageSize };
  },
  

  // Obtener un producto por ID
  async getProductoById(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    const producto = await prisma.productos.findUnique({
      where: { id },
      include: {
        categoria: true,
        promocion: true,
      },
    });
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  },

  // Crear un nuevo producto
  async createProducto(data) {
    if (
      !data ||
      !data.nombre ||
      !data.descripcion ||
      typeof data.precio !== 'number' ||
      typeof data.stock !== 'number' ||
      !data.categoriaId ||
      !data.promocionId ||
      !data.especificaciones ||
      !data.marca ||
      !data.garantia
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
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Los datos para actualizar no pueden estar vacíos');
    }

    // Validar que todos los campos requeridos estén presentes
    if (
      !data.promocionId ||
      !data.especificaciones ||
      !data.marca ||
      !data.garantia
    ) {
      throw new Error(
        'Datos incompletos o inválidos para actualizar el producto'
      );
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
