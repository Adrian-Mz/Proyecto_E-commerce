import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ProductosData = {
  // Obtener todos los productos
  async getAllProductos({ search = "", categoriaId = null, page = 1, pageSize = 0 }) {
    const skip = pageSize > 0 ? (page - 1) * pageSize : undefined; // Salta registros solo si pageSize > 0
    const take = pageSize > 0 ? pageSize : undefined; // Limita registros solo si pageSize > 0
  
    const where = {
      AND: [
        search ? { nombre: { contains: search, mode: "insensitive" } } : {}, // Filtro por nombre
        categoriaId ? { categoriaId: categoriaId } : {}, // Filtro por categoría
      ],
    };
  
    // Consulta para obtener los productos
    const productos = await prisma.productos.findMany({
      where,
      skip,
      take,
      include: {
        categoria: true,
        promocion: true,
      },
    });
  
    // Total de productos que cumplen los criterios
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
  
    // Realiza la actualización sin validar campos obligatorios
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
