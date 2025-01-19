import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ProductosData = {
  // Obtener todos los productos
  async getAllProductos({ search = "", categoriaId = null, page = 1, pageSize = 0 }) {
    const skip = pageSize > 0 ? (page - 1) * pageSize : undefined;
    const take = pageSize > 0 ? pageSize : undefined;
  
    const where = {
      AND: [
        search ? { nombre: { contains: search, mode: "insensitive" } } : {},
        categoriaId ? { categoriaId: categoriaId } : {},
      ],
    };
  
    const productos = await prisma.productos.findMany({
      where,
      skip,
      take,
      orderBy: { id: "asc" }, // Ordena los resultados por ID de forma ascendente
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

    // Obtener el producto de la base de datos
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

    // Verificar si el producto tiene una promoción asociada
    if (!producto.promocion) {
      console.log('La promoción no está asociada al producto:', producto.id);
    }

    return producto;
  },


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
      throw new Error('Datos incompletos o inválidos para crear el producto');
    }
  
    // Depuración: Mostrar los datos enviados a Prisma
    console.log('Datos enviados a Prisma:', data);
  
    // Crear el producto
    return await prisma.productos.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock,
        imagen: data.imagen,
        categoriaId: data.categoriaId,
        promocionId: data.promocionId,
        especificaciones: data.especificaciones,
        marca: data.marca,
        garantia: data.garantia,
      },
    });
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
