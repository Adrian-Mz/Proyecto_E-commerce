import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ReportsData = {
  // Obtener ventas con filtros dinámicos
  async getVentas({ fechaInicio, fechaFin, categoriaId, marca }) {
    const where = {
      fechaPedido: {
        gte: fechaInicio ? new Date(fechaInicio) : undefined,
        lte: fechaFin ? new Date(fechaFin) : undefined,
      },
      productos: {
        some: {
          producto: {
            categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
            marca: marca ? { contains: marca, mode: "insensitive" } : undefined,
          },
        },
      },
    };

    return await prisma.pedidos.findMany({
      where,
      include: {
        usuario: { select: { nombre: true, apellido: true, correo: true } },
        productos: {
          include: {
            producto: {
              select: { nombre: true, precioBase: true, ivaPorcentaje: true, marca: true },
            },
          },
        },
      },
      orderBy: { fechaPedido: "desc" },
    });
  },

  // Obtener cantidad de pedidos por rango de fechas
  async getCantidadPedidos({ fechaInicio, fechaFin }) {
    return await prisma.pedidos.count({
      where: {
        fechaPedido: {
          gte: fechaInicio ? new Date(fechaInicio) : undefined,
          lte: fechaFin ? new Date(fechaFin) : undefined,
        },
      },
    });
  },

  // Obtener ingresos totales por rango de fechas
  async getIngresosNetos({ fechaInicio, fechaFin }) {
    // 🔹 Obtener ingresos totales por pedidos completados en el rango de fechas
    const ingresosBrutos = await prisma.pedidos.aggregate({
      _sum: { total: true },
      where: {
        fechaPedido: {
          gte: fechaInicio ? new Date(fechaInicio) : undefined,
          lte: fechaFin ? new Date(fechaFin) : undefined,
        },
      },
    });

    // 🔹 Obtener el total del IVA sumando (precio_unitario * cantidad * IVA%) en los productos vendidos
    const productosConIva = await prisma.pedido_productos.findMany({
      where: {
        pedido: {
          fechaPedido: {
            gte: fechaInicio ? new Date(fechaInicio) : undefined,
            lte: fechaFin ? new Date(fechaFin) : undefined,
          },
        },
      },
      select: {
        precio_unitario: true,
        cantidad: true,
        producto: {
          select: { ivaPorcentaje: true }, // 🔹 Asegurarse de que el IVA provenga del modelo `producto`
        },
      },
    });

    const ivaTotal = productosConIva.reduce((total, item) => {
      const iva = (item.precio_unitario * item.cantidad * (item.producto?.ivaPorcentaje || 0)) / 100;
      return total + iva;
    }, 0);

    // 🔹 Obtener el total de devoluciones realizadas en el rango de fechas
    const devoluciones = await prisma.devoluciones.aggregate({
      _sum: { montoReembolsado: true },
      where: {
        fechaDevolucion: {
          gte: fechaInicio ? new Date(fechaInicio) : undefined,
          lte: fechaFin ? new Date(fechaFin) : undefined,
        },
      },
    });

    // 🔹 Obtener el total de descuentos aplicados en promociones
    const descuentos = await prisma.pedido_productos.aggregate({
      _sum: { precio_unitario: true },
      where: {
        producto: {
          promocionId: { not: null }, // Solo productos con promociones aplicadas
        },
        pedido: {
          fechaPedido: {
            gte: fechaInicio ? new Date(fechaInicio) : undefined,
            lte: fechaFin ? new Date(fechaFin) : undefined,
          },
        },
      },
    });

    // 🔹 Calcular ingresos netos considerando todos los valores
    return {
      ingresosBrutos: ingresosBrutos._sum.total || 0,
      ivaTotal: ivaTotal || 0,
      descuentosAplicados: descuentos._sum.precio_unitario || 0,
      devoluciones: devoluciones._sum.montoReembolsado || 0,
      ingresosNetos:
        (ingresosBrutos._sum.total || 0) - 
        (ivaTotal || 0) - 
        (descuentos._sum.precio_unitario || 0) - 
        (devoluciones._sum.montoReembolsado || 0),
    };
  },

  // Obtener devoluciones por fechas
  async getDevoluciones({ fechaInicio, fechaFin }) {
    return await prisma.devoluciones.findMany({
      where: {
        fechaDevolucion: {
          gte: fechaInicio ? new Date(fechaInicio) : undefined,
          lte: fechaFin ? new Date(fechaFin) : undefined,
        },
      },
      include: {
        pedido: { select: { id: true, fechaPedido: true } },
        producto: { select: { nombre: true, precioBase: true } },
      },
    });
  },

  // Obtener usuarios registrados en un rango de fechas
  async getUsuariosRegistrados({ fechaInicio, fechaFin }) {
    return await prisma.usuarios.findMany({
      where: {
        fechaRegistro: {
          gte: fechaInicio ? new Date(fechaInicio) : undefined,
          lte: fechaFin ? new Date(fechaFin) : undefined,
        },
      },
      select: { id: true, nombre: true, apellido: true, correo: true, fechaRegistro: true },
      orderBy: { fechaRegistro: "desc" },
    });
  },

  async getProductosMasVendidos({ fechaInicio, fechaFin }) {
    const productosVendidos = await prisma.pedido_productos.groupBy({
      by: ["productoId"], // Agrupar por productoId
      _sum: { cantidad: true }, // Sumar cantidad vendida
      orderBy: { _sum: { cantidad: "desc" } }, // Ordenar por cantidad vendida
      take: 10, // Limitar a los 10 más vendidos
      where: {
        pedido: {
          fechaPedido: {
            gte: fechaInicio ? new Date(fechaInicio) : undefined,
            lte: fechaFin ? new Date(fechaFin) : undefined,
          },
        },
      },
    });

    if (!productosVendidos || productosVendidos.length === 0) {
      return [];
    }

    // Obtener detalles de los productos
    const productosDetalles = await prisma.productos.findMany({
      where: { id: { in: productosVendidos.map(p => p.productoId) } },
      select: {
        id: true,
        nombre: true,
        marca: true,
        precioBase: true,
        ivaPorcentaje: true,
      },
    });

    return productosVendidos.map((p) => ({
      productoId: p.productoId,
      cantidadVendida: p._sum?.cantidad || 0, // 🔹 Solo sumamos cantidad
      detalles: productosDetalles.find(prod => prod.id === p.productoId) || null,
    }));
  }


  
};
