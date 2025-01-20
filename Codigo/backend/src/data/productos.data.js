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
        categoriaId ? { categoriaId: categoriaId } : {}, // Filtro por categoría directa
      ],
    };
  
    const productos = await prisma.productos.findMany({
      where,
      skip,
      take,
      orderBy: { id: "asc" },
      include: {
        categoria: true, // Relación directa con categoría
        promocion: true, // Relación directa con promoción
      },
    });
  
    const total = await prisma.productos.count({ where });
  
    return { productos, total, page, pageSize };
  },    

  // Obtener un producto por ID
  async getProductoById(id) {
    if (typeof id !== "number") {
      throw new Error("El ID debe ser un número");
    }
  
    const producto = await prisma.productos.findUnique({
      where: { id },
      include: {
        categoria: true, // Relación directa con categoría
        promocion: true, // Relación directa con promoción
      },
    });
  
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
  
    return producto;
  },  

  async createProducto(data) {
    if (
      !data ||
      !data.nombre ||
      !data.descripcion ||
      typeof data.precio !== "number" ||
      typeof data.stock !== "number" ||
      !data.categoriaId || // Asegúrate de que exista la categoría
      !data.especificaciones ||
      !data.marca ||
      !data.garantia
    ) {
      throw new Error("Datos incompletos o inválidos para crear el producto");
    }
  
    console.log("Datos enviados a Prisma:", data);
  
    return await prisma.productos.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock,
        imagen: data.imagen,
        categoriaId: data.categoriaId, // Aquí conecta con una sola categoría
        promocionId: data.promocionId || null, // Promoción es opcional
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

  // Actualizar productos por categoría
  async updateProductosByCategoria(categoriaId, promocionId) {
    return await prisma.productos.updateMany({
        where: { categoriaId },
        data: { promocionId },
    });
  },

  async getCategoriaByName(nombre) {
    return await prisma.categorias.findFirst({
      where: { nombre },
    });
  },

  // Obtener promoción por nombre
  async getPromocionByName(nombre) {
    return await prisma.promociones.findFirst({
      where: { nombre },
    });
  },
};
