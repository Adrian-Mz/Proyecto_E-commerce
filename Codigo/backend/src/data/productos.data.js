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
        promocion: {
          where: {
            OR: [
              { fechaInicio: { lte: new Date() }, fechaFin: { gte: new Date() } }, // Promoción dentro del rango de fechas
              { fechaInicio: null, fechaFin: null }, // Productos sin promoción asignada
            ],
          },
        }, // Relación directa con promoción (solo si está activa)
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
      isNaN(data.precioBase) || // Verificar que precioBase sea numérico
      isNaN(data.stock) ||  // Verificar que stock sea numérico
      !data.categoriaId ||  // Verificar que exista categoría
      !data.especificaciones ||
      !data.marca ||
      !data.garantia ||
      isNaN(data.ivaPorcentaje)
    ) {
      throw new Error("Datos incompletos o inválidos para crear el producto");
    }
  
    console.log("Datos enviados a Prisma:", data);
  
    return await prisma.productos.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioBase: parseFloat(data.precioBase),
        precio: parseFloat((data.precioBase * (1 + data.ivaPorcentaje / 100)).toFixed(2)), // Calcula el precio con IVA
        stock: data.stock,
        imagen: data.imagen, // Ahora la imagen es una URL
        categoriaId: data.categoriaId,
        promocionId: data.promocionId || null,
        especificaciones: data.especificaciones,
        marca: data.marca,
        garantia: data.garantia,
        ivaPorcentaje: data.ivaPorcentaje
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

  // Buscar producto en la base de datos
  async buscarProductosPorNombreOCategoria(termino, limit = 5) {
    console.log('Buscando productos con el término:', termino);
  
    const resultados = await prisma.productos.findMany({
      where: {
        OR: [
          { nombre: { contains: termino, mode: 'insensitive' } }, // Búsqueda por nombre
          { categoria: { nombre: { contains: termino, mode: 'insensitive' } } }, // Búsqueda en categoría
        ],
      },
      include: {
        categoria: true, // Incluye datos de la categoría en los resultados
      },
      orderBy: { nombre: 'asc' }, // Ordena alfabéticamente por nombre
      take: parseInt(limit, 10), // Limita la cantidad de resultados
    });
  
    console.log('Resultados relaciones encontrados con éxito');
    return resultados;
  },

  async incremetarStock(productoId, cantidad) {
    return await prisma.productos.update({
      where: {id: productoId},
      data: {stock: {increment:cantidad } },
    });
  },

  // Actualizar productos por categoría (Sincronizar promociones)
  async updateProductosByCategoria(categoriaId, promocionId) {
    return await prisma.productos.updateMany({
      where: { categoriaId },
      data: { promocionId },
    });
  },

  // 🔹 Actualizar el IVA en todos los productos de una categoría
  async actualizarIvaEnProductosPorCategoria(categoriaId, nuevoIva) {
    if (isNaN(categoriaId) || isNaN(nuevoIva)) {
      throw new Error('IDs y valores de IVA deben ser numéricos.');
    }

    const ivaPorcentaje = parseFloat(nuevoIva.toFixed(2));

    return await prisma.productos.updateMany({
      where: { categoriaId },
      data: {
        ivaPorcentaje,
        precio: {
          multiply: (1 + ivaPorcentaje / 100), // Recalcula el precio con el nuevo IVA
        },
      },
    });
  },

  async getIvaPorCategoria(categoriaId) {
    const categoriaIva = await prisma.categoria_iva.findUnique({
        where: { categoriaId },
    });

    return categoriaIva ? categoriaIva.ivaPorcentaje : null;
  },


};