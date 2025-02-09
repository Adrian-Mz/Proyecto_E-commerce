import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ReportsData = {
  async getReporteCompleto() {
    try {
      // 🔹 Obtener todas las ventas
      const ventas = await prisma.pedidos.findMany({
        include: {
          usuario: { select: { nombre: true, apellido: true, correo: true } },
          productos: {
            include: {
              producto: { select: { nombre: true, marca: true, precioBase: true, ivaPorcentaje: true } },
            },
          },
          metodoPago: { select: { nombre: true } },
          metodoEnvio: { select: { nombre: true, costo: true } },
        },
        orderBy: { fechaPedido: "desc" },
      });

      // 🔹 Obtener productos más vendidos
      const productosVendidos = await prisma.pedido_productos.groupBy({
        by: ["productoId"],
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: "desc" } },
        take: 10,
      });

      // 🔹 Obtener detalles de los productos vendidos
      const productosDetalles = await prisma.productos.findMany({
        where: { id: { in: productosVendidos.map(p => p.productoId) } },
        select: { id: true, nombre: true, marca: true, precioBase: true, ivaPorcentaje: true },
      });

      // 🔹 Obtener devoluciones
      const devoluciones = await prisma.devoluciones.findMany({
        include: {
          pedido: { select: { id: true, fechaPedido: true } },
          producto: { select: { nombre: true, precioBase: true } },
          estado: { select: { nombre: true } }
        },
      });

      // 🔹 Obtener usuarios registrados
      const usuarios = await prisma.usuarios.findMany({
        select: { id: true, nombre: true, apellido: true, correo: true, fechaRegistro: true },
      });

      // 🔹 Obtener ingresos totales
      const ingresosBrutos = await prisma.pedidos.aggregate({ _sum: { total: true } });

      // 🔹 Obtener total de descuentos en promociones
      const descuentos = await prisma.pedido_productos.aggregate({
        _sum: { precio_unitario: true },
        where: { producto: { promocionId: { not: null } } },
      });

      // 🔹 Obtener total de devoluciones
      const devolucionesTotal = await prisma.devoluciones.aggregate({ _sum: { montoReembolsado: true } });

      // 🔹 Conteo total de registros en cada tabla relevante
      const conteos = {
        totalPedidos: await prisma.pedidos.count(),
        totalProductos: await prisma.productos.count(),
        totalDevoluciones: await prisma.devoluciones.count(),
        totalUsuarios: await prisma.usuarios.count(),
      };

      return {
        ventas,
        productosVendidos,
        productosDetalles,
        devoluciones,
        usuarios,
        ingresos: {
          brutos: ingresosBrutos._sum.total || 0,
          descuentos: descuentos._sum.precio_unitario || 0,
          devoluciones: devolucionesTotal._sum.montoReembolsado || 0,
          netos: (ingresosBrutos._sum.total || 0) - (descuentos._sum.precio_unitario || 0) - (devolucionesTotal._sum.montoReembolsado || 0),
        },
        conteos, // 🔹 Agregamos conteos de tablas
      };
    } catch (error) {
      throw new Error("Error al obtener los datos completos: " + error.message);
    }
  },
};
