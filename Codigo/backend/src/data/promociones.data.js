import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const promocionesData = {
  // Obtener una promoción por ID, incluyendo categorías asociadas
  async getPromocionById(promocionId) {
    return await prisma.promociones.findUnique({
      where: { id: promocionId },
      include: {
        categorias: {
          include: {
            categoria: true, // Incluye detalles de las categorías asociadas
          },
        },
      },
    });
  },

  // Obtener todas las promociones
  async getAllPromociones() {
    return await prisma.promociones.findMany({
      orderBy: { id: 'asc' },
      include: {
        categorias: {
          include: {
            categoria: true, // Incluir detalles de las categorías
          },
        },
      },
    });
  },

  // Crear una nueva promoción
  async createPromocion(datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categorias } = datosPromocion;

    // Validar que categorias sea un arreglo
    const categoriasValidas = Array.isArray(categorias) ? categorias : [];

    return await prisma.promociones.create({
      data: {
        nombre,
        descripcion,
        descuento,
        fechaInicio,
        fechaFin,
        ...(categoriasValidas.length > 0 && {
          categorias: {
            create: categoriasValidas.map((categoriaId) => ({
              categoria: { connect: { id: categoriaId } },
            })),
          },
        }),
      },
    });
  },

  // Actualizar una promoción existente, incluyendo productos asociados
  async updatePromocion(promocionId, datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categorias } = datosPromocion;

    // Actualización de los datos principales de la promoción
    const updatedPromocion = await prisma.promociones.update({
      where: { id: promocionId },
      data: {
        nombre,
        descripcion,
        descuento,
        fechaInicio,
        fechaFin,
      },
    });

    if (categorias && categorias.length > 0) {
      // Actualizar categorías y productos relacionados
      await this.actualizarCategoriasYProductos(promocionId, categorias);
    }

    return updatedPromocion;
  },

  async actualizarCategoriasYProductos(promocionId, categorias) {
    if (!categorias || categorias.length === 0) {
      // Si no hay categorías, asignar los productos a la promoción "Sin promoción" (ID 6)
      await prisma.productos.updateMany({
        where: { promocionId },
        data: { promocionId: 6 }, // ID 6 para "Sin promoción"
      });
  
      // Eliminar las relaciones con categorías
      await prisma.categoria_promocion.deleteMany({
        where: { promocionId },
      });
  
      return;
    }
  
    // Eliminar las relaciones existentes
    await prisma.categoria_promocion.deleteMany({
      where: { promocionId },
    });
  
    // Crear nuevas relaciones para las categorías
    await prisma.categoria_promocion.createMany({
      data: categorias.map((categoriaId) => ({
        promocionId,
        categoriaId,
      })),
      skipDuplicates: true,
    });
  
    // Obtener productos actuales asociados a las categorías
    const productosIds = await prisma.productos.findMany({
      where: { categoriaId: { in: categorias } },
      select: { id: true },
    }).then((productos) => productos.map((p) => p.id));
  
    // Actualizar los productos con la promoción
    await prisma.productos.updateMany({
      where: { id: { in: productosIds } },
      data: { promocionId },
    });
  
    // Eliminar la promoción de productos que ya no están en las categorías asociadas
    await prisma.productos.updateMany({
      where: {
        promocionId,
        categoriaId: { notIn: categorias },
      },
      data: { promocionId: 6 }, // Asignar a "Sin promoción" (ID 6)
    });
  },  

  // Eliminar una promoción
  async deletePromocion(promocionId) {
    await prisma.categoria_promocion.deleteMany({
      where: { promocionId },
    });
    await prisma.productos.updateMany({
      where: { promocionId },
      data: { promocionId: null },
    });
    return await prisma.promociones.delete({
      where: { id: promocionId },
    });
  },

  // Eliminar categorías asociadas a una promoción específica
  async eliminarCategoriasDePromocion(promocionId, categoriasIds) {
    if (!Array.isArray(categoriasIds) || categoriasIds.length === 0) {
      throw new Error('Debe proporcionar una lista de categorías válidas para eliminar.');
    }

    await prisma.categoria_promocion.deleteMany({
      where: {
        promocionId,
        categoriaId: { in: categoriasIds },
      },
    });

    // Eliminar la promoción de los productos de las categorías eliminadas
    await prisma.productos.updateMany({
      where: {
        promocionId,
        categoriaId: { in: categoriasIds },
      },
      data: { promocionId: null },
    });
  },

  // Verificar si una categoría existe
  async getCategoriaById(categoriaId) {
    return await prisma.categorias.findUnique({
      where: { id: categoriaId },
    });
  },

  // Verificar si las categorías tienen promociones activas
  async getCategoriasConPromocionActiva(categoriasIds, promocionId = null) {
    const categoriasConPromocion = await prisma.categoria_promocion.findMany({
      where: {
        categoriaId: { in: categoriasIds },
        ...(promocionId ? { promocionId: { not: promocionId } } : {}), // Excluir la promoción actual si se especifica
      },
      include: { promocion: true },
    });

    return categoriasConPromocion.map((relacion) => ({
      categoriaId: relacion.categoriaId,
      promocionId: relacion.promocionId,
    }));
  },

  // Obtener los productos por categorías
  async getProductosByCategoria(categoriaId) {
    return await prisma.productos.findMany({
      where: { categoriaId },
    });
  },

  async agregarCategoriasAPromocion(promocionId, categorias) {
    if (!Array.isArray(categorias) || categorias.length === 0) {
      throw new Error('Debe proporcionar una lista de categorías válida.');
    }

    // Crear relaciones de categorías con la promoción
    return await prisma.categoria_promocion.createMany({
      data: categorias.map((categoriaId) => ({
        promocionId,
        categoriaId,
      })),
      skipDuplicates: true,
    });
  },
};
