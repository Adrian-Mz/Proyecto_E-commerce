import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productosService = {
  // 🔹 Obtener los productos más vendidos
  async productosMasVendidos(limit = 10) {
    const productosVendidos = await prisma.pedido_productos.groupBy({
      by: ['productoId'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: limit,
    });

    return Promise.all(productosVendidos.map(async (p) => {
      const producto = await prisma.productos.findUnique({
        where: { id: p.productoId },
        select: { nombre: true, categoria: { select: { nombre: true } } },
      });

      return {
        productoId: p.productoId,
        nombre: producto?.nombre || "Desconocido",
        categoria: producto?.categoria?.nombre || "Sin categoría",
        cantidadVendida: p._sum.cantidad || 0,
      };
    }));
  },

  // 🔹 Obtener los productos con mayor ingreso total
  async productosConMayorIngreso(limit = 10) {
    const productosIngresos = await prisma.pedido_productos.groupBy({
      by: ['productoId'],
      _sum: { precio_unitario: true, cantidad: true },
      orderBy: { _sum: { precio_unitario: 'desc' } },
      take: limit,
    });

    return Promise.all(productosIngresos.map(async (p) => {
      const producto = await prisma.productos.findUnique({
        where: { id: p.productoId },
        select: { nombre: true, categoria: { select: { nombre: true } } },
      });

      return {
        productoId: p.productoId,
        nombre: producto?.nombre || "Desconocido",
        categoria: producto?.categoria?.nombre || "Sin categoría",
        ingresoGenerado: (p._sum.precio_unitario || 0) * (p._sum.cantidad || 0),
      };
    }));
  },

  // 🔹 Obtener las categorías más vendidas
  async categoriasMasVendidas(limit = 10) {
    const categoriasVendidas = await prisma.pedido_productos.groupBy({
      by: ['productoId'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: limit,
    });

    return Promise.all(categoriasVendidas.map(async (c) => {
      const producto = await prisma.productos.findUnique({
        where: { id: c.productoId },
        select: { categoria: { select: { id: true, nombre: true } } },
      });

      return {
        categoriaId: producto?.categoria?.id || "Desconocido",
        categoria: producto?.categoria?.nombre || "Sin categoría",
        cantidadVendida: c._sum.cantidad || 0,
      };
    }));
  },

  // 🔹 Obtener productos con stock bajo (menor a un umbral)
  async productosStockBajo(umbral = 5) {
    return await prisma.productos.findMany({
      where: { stock: { lt: umbral } },
      select: { id: true, nombre: true, stock: true },
    });
  },
};
