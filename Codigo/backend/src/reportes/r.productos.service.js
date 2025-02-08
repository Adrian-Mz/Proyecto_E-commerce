import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productosService = {
  // 🔹 Obtener los productos más vendidos
  async productosMasVendidos({ limit = 10, categoriaId = null, fechaInicio = null, fechaFin = null }) {
    // Construir filtro dinámico
    const where = {
      pedido: {
        estadoId: 4, // Solo considerar pedidos completados
        ...(fechaInicio && fechaFin && {
          fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
        }),
      },
      ...(categoriaId && { producto: { categoriaId: parseInt(categoriaId, 10) } }),
    };
  
    // Obtener productos vendidos con filtros
    const productosVendidos = await prisma.pedido_productos.groupBy({
      by: ['productoId'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: parseInt(limit, 10),
      where,
    });
  
    // Obtener detalles de los productos en una sola consulta
    const productosIds = productosVendidos.map(p => p.productoId);
    const productosDetalles = await prisma.productos.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, nombre: true, categoria: { select: { nombre: true } } },
    });
  
    // Crear mapa para acceso rápido
    const productosMap = Object.fromEntries(productosDetalles.map(p => [p.id, p]));
  
    // Formatear la respuesta
    return productosVendidos.map(p => ({
      productoId: p.productoId,
      nombre: productosMap[p.productoId]?.nombre || "Desconocido",
      categoria: productosMap[p.productoId]?.categoria?.nombre || "Sin categoría",
      cantidadVendida: p._sum.cantidad || 0,
    }));
  },
  
  // 🔹 Productos con mayor ingreso total con filtros
  async productosConMayorIngreso({ limit = 10, categoriaId = null, fechaInicio = null, fechaFin = null }) {
    const where = {
      pedido: {
        estadoId: 4, // Solo pedidos completados
        ...(fechaInicio && fechaFin && {
          fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
        }),
      },
      ...(categoriaId && { producto: { categoriaId: parseInt(categoriaId, 10) } }),
    };
  
    const productosIngresos = await prisma.pedido_productos.groupBy({
      by: ['productoId'],
      _sum: { precio_unitario: true, cantidad: true },
      orderBy: { _sum: { precio_unitario: 'desc' } },
      take: parseInt(limit, 10),
      where,
    });
  
    const productosIds = productosIngresos.map(p => p.productoId);
    const productosDetalles = await prisma.productos.findMany({
      where: { id: { in: productosIds } },
      select: { id: true, nombre: true, categoria: { select: { nombre: true } } },
    });
  
    const productosMap = Object.fromEntries(productosDetalles.map(p => [p.id, p]));
  
    return productosIngresos.map(p => ({
      productoId: p.productoId,
      nombre: productosMap[p.productoId]?.nombre || "Desconocido",
      categoria: productosMap[p.productoId]?.categoria?.nombre || "Sin categoría",
      ingresoGenerado: (p._sum.precio_unitario || 0) * (p._sum.cantidad || 0),
    }));
  },

  // 🔹 Obtener las categorías más vendidas (acumulando ventas por categoría)
  async categoriasMasVendidas(limit = null) {
  const categoriasVendidas = await prisma.pedido_productos.groupBy({
    by: ['productoId'],
    _sum: { cantidad: true },
  });

  const categoriasMap = new Map();

  for (const c of categoriasVendidas) {
    const producto = await prisma.productos.findUnique({
      where: { id: c.productoId },
      select: { categoria: { select: { id: true, nombre: true } } },
    });

    if (producto?.categoria) {
      const categoriaId = producto.categoria.id;
      const categoriaNombre = producto.categoria.nombre;
      const cantidadVendida = c._sum.cantidad || 0;

      // Si la categoría ya existe en el mapa, acumular la cantidad vendida
      if (categoriasMap.has(categoriaId)) {
        categoriasMap.set(categoriaId, {
          categoriaId,
          categoria: categoriaNombre,
          cantidadVendida: categoriasMap.get(categoriaId).cantidadVendida + cantidadVendida,
        });
      } else {
        categoriasMap.set(categoriaId, {
          categoriaId,
          categoria: categoriaNombre,
          cantidadVendida,
        });
      }
    }
  }

  // Convertir el mapa en array y ordenar por cantidad vendida
  const categoriasOrdenadas = Array.from(categoriasMap.values()).sort(
    (a, b) => b.cantidadVendida - a.cantidadVendida
  );

    return limit ? categoriasOrdenadas.slice(0, limit) : categoriasOrdenadas;
  },

  // 🔹 Obtener productos con stock bajo (menor a un umbral)
  async productosStockBajo(umbral = 5) {
    return await prisma.productos.findMany({
      where: { stock: { lt: umbral } },
      select: { id: true, nombre: true, stock: true },
    });
  },
};
