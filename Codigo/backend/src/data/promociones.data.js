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

    return await prisma.promociones.create({
      data: {
        nombre,
        descripcion,
        descuento,
        fechaInicio,
        fechaFin,
        categorias: {
          create: categorias.map((categoriaId) => ({
            categoria: { connect: { id: categoriaId } },
          })),
        },
      },
    });
  },

  // Actualizar una promoción existente
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
      // Obtener las relaciones actuales entre la promoción y las categorías
      const relacionesActuales = await prisma.categoria_promocion.findMany({
        where: { promocionId },
        select: { categoriaId: true },
      });
  
      const categoriasActuales = relacionesActuales.map((relacion) => relacion.categoriaId);
  
      // Identificar categorías a agregar y eliminar
      const categoriasAEliminar = categoriasActuales.filter(
        (categoriaId) => !categorias.includes(categoriaId)
      );
      const categoriasAAgregar = categorias.filter(
        (categoriaId) => !categoriasActuales.includes(categoriaId)
      );
  
      // Eliminar categorías que ya no están asociadas
      if (categoriasAEliminar.length > 0) {
        await prisma.categoria_promocion.deleteMany({
          where: {
            promocionId,
            categoriaId: { in: categoriasAEliminar },
          },
        });
      }
  
      // Agregar nuevas categorías a la promoción
      if (categoriasAAgregar.length > 0) {
        await prisma.categoria_promocion.createMany({
          data: categoriasAAgregar.map((categoriaId) => ({
            promocionId,
            categoriaId,
          })),
          skipDuplicates: true, // Evita errores si alguna relación ya existe
        });
      }
    }
  
    return updatedPromocion;
  },  

  // Eliminar una promoción
  async deletePromocion(promocionId) {
    await prisma.categoria_promocion.deleteMany({
      where: { promocionId },
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

    return await prisma.categoria_promocion.deleteMany({
      where: {
        promocionId,
        categoriaId: { in: categoriasIds },
      },
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
      skipDuplicates: true, // Evita errores si alguna categoría ya está relacionada
    });
  },
  
  async actualizarCategoriasPromocion(promocionId, categorias) {
    // Si no hay categorías, eliminamos todas las relaciones
    if (!categorias || categorias.length === 0) {
      await prisma.categoria_promocion.deleteMany({
        where: { promocionId },
      });
    } else {
      // Si hay categorías, eliminamos las existentes y agregamos las nuevas
      await prisma.categoria_promocion.deleteMany({
        where: { promocionId },
      });
      await prisma.categoria_promocion.createMany({
        data: categorias.map((categoriaId) => ({
          promocionId,
          categoriaId,
        })),
        skipDuplicates: true, // Evitar duplicados si aplica
      });
    }
  }  
};
