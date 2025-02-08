import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CategoriaData = {
  // Obtener todas las categorías con su IVA
  async getAllCategorias() {
    return await prisma.categorias.findMany({
        orderBy: { id: 'asc' },
        include: {
            productos: { orderBy: { id: 'asc' } },
            promociones: { include: { promocion: true } },
            categoria_iva: true, // 🔹 Incluir el IVA de la categoría
        },
    });
  },

  // Obtener una categoría por ID con su IVA
  async getCategoriaById(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }
    return await prisma.categorias.findUnique({
      where: { id },
      include: {
        productos: true,
        promociones: { include: { promocion: true } },
        categoria_iva: true, // 🔹 Incluir el IVA de la categoría
      },
    });
  },

  // Crear una nueva categoría
  async createCategoria(data) {
    if (!data || !data.nombre || !data.descripcion) {
      throw new Error('Datos incompletos para crear la categoría');
    }
    
    // 🔹 Crear la categoría y su IVA (si viene en los datos)
    return await prisma.$transaction(async (prisma) => {
      const nuevaCategoria = await prisma.categorias.create({ data });

      if (data.ivaPorcentaje !== undefined) {
        await prisma.categoria_iva.create({
          data: {
            categoriaId: nuevaCategoria.id,
            ivaPorcentaje: data.ivaPorcentaje,
          },
        });
      }

      return nuevaCategoria;
    });
  },

  // Actualizar una categoría (incluyendo su IVA)
  async updateCategoria(id, data) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }

    const { id: _, ivaPorcentaje, ...actualData } = data; // 🔹 Extraer IVA para actualizarlo aparte

    return await prisma.$transaction(async (prisma) => {
      const categoriaActualizada = await prisma.categorias.update({
        where: { id },
        data: actualData,
      });

      // 🔹 Si se proporciona un nuevo IVA, actualizarlo
      if (ivaPorcentaje !== undefined) {
        await prisma.categoria_iva.upsert({
          where: { categoriaId: id },
          update: { ivaPorcentaje },
          create: { categoriaId: id, ivaPorcentaje },
        });

        // 🔹 Actualizar el IVA en los productos de esta categoría
        const productos = await prisma.productos.findMany({
          where: { categoriaId: id },
          select: { id: true, precioBase: true },
        });

        await Promise.all(
          productos.map((producto) =>
            prisma.productos.update({
              where: { id: producto.id },
              data: {
                ivaPorcentaje,
                precio: parseFloat((producto.precioBase * (1 + ivaPorcentaje / 100)).toFixed(2)),
              },
            })
          )
        );
      }

      return categoriaActualizada;
    });
  },

  // Eliminar una categoría (incluyendo su IVA)
  async deleteCategoria(id) {
    if (typeof id !== 'number') {
      throw new Error('El ID debe ser un número');
    }

    return await prisma.$transaction(async (prisma) => {
      await prisma.categoria_iva.deleteMany({ where: { categoriaId: id } }); // 🔹 Borrar su IVA antes
      return await prisma.categorias.delete({ where: { id } });
    });
  },
};
