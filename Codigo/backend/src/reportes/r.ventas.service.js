import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export const ventasService = {
  // 🔹 Total de ventas con opción de filtrar por fecha y estado
  async totalVentas({ fechaInicio = null, fechaFin = null, estadoId = 4 } = {}) {
    const where = {
      estadoId,
      ...(fechaInicio && fechaFin && {
        fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    const resultado = await prisma.pedidos.aggregate({
      _sum: { total: true },
      where,
    });

    return { totalVentas: resultado._sum.total || 0 };
  },

  // 🔹 Cantidad total de pedidos con filtros dinámicos
  async cantidadPedidos({ fechaInicio = null, fechaFin = null, estadoId = null } = {}) {
    const where = {
      ...(estadoId && { estadoId }),
      ...(fechaInicio && fechaFin && {
        fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    const resultado = await prisma.pedidos.count({ where });
    return { totalPedidos: resultado };
  },

  // 🔹 Ventas por método de pago con filtros de fecha y estado
  async ventasPorMetodoPago({ fechaInicio = null, fechaFin = null, estadoId = 4 } = {}) {
    const where = {
      estadoId,
      ...(fechaInicio && fechaFin && {
        fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    const resultado = await prisma.pedidos.groupBy({
      by: ['metodoPagoId'],
      _count: { metodoPagoId: true },
      where,
      orderBy: { _count: { metodoPagoId: 'desc' } },
    });

    // Obtener detalles de los métodos de pago
    const metodosPago = await prisma.metodo_pago.findMany();

    return resultado.map(m => ({
      metodoPagoId: m.metodoPagoId,
      metodoPago: metodosPago.find(mp => mp.id === m.metodoPagoId)?.nombre || 'Desconocido',
      cantidad: m._count.metodoPagoId,
    }));
  },

  // 🔹 Ventas por método de envío con filtros de fecha y estado
  async ventasPorMetodoEnvio({ fechaInicio = null, fechaFin = null, estadoId = 4 } = {}) {
    const where = {
      estadoId,
      ...(fechaInicio && fechaFin && {
        fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    const resultado = await prisma.pedidos.groupBy({
      by: ['metodoEnvioId'],
      _count: { metodoEnvioId: true },
      where,
      orderBy: { _count: { metodoEnvioId: 'desc' } },
    });

    // Obtener detalles de los métodos de envío
    const metodosEnvio = await prisma.metodo_envio.findMany();

    return resultado.map(m => ({
      metodoEnvioId: m.metodoEnvioId,
      metodoEnvio: metodosEnvio.find(me => me.id === m.metodoEnvioId)?.nombre || 'Desconocido',
      cantidad: m._count.metodoEnvioId,
    }));
  },

  // 🔹 Ingresos agrupados por fecha con detalles de pedidos y filtros dinámicos
  async ingresosPorFecha({ agrupacion = 'month', fechaInicio = null, fechaFin = null, estadoId = 4 } = {}) {
    const where = {
      estadoId,
      ...(fechaInicio && fechaFin && {
        fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    const resultado = await prisma.pedidos.findMany({
      select: {
        id: true,
        fechaPedido: true,
        total: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
          },
        },
      },
      where,
      orderBy: { fechaPedido: 'asc' },
    });

    // Agrupar los resultados por día, mes o año
    const ingresosAgrupados = resultado.reduce((acc, pedido) => {
      let claveFecha;
      const fechaFormateada = format(new Date(pedido.fechaPedido), 'yyyy-MM-dd');

      if (agrupacion === 'day') {
        claveFecha = fechaFormateada;
      } else if (agrupacion === 'month') {
        claveFecha = format(new Date(pedido.fechaPedido), 'yyyy-MM');
      } else if (agrupacion === 'year') {
        claveFecha = format(new Date(pedido.fechaPedido), 'yyyy');
      }

      if (!acc[claveFecha]) {
        acc[claveFecha] = { total: 0, pedidos: [] };
      }
      acc[claveFecha].total += Number(pedido.total);
      acc[claveFecha].pedidos.push({
        pedidoId: pedido.id,
        usuario: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,
        correo: pedido.usuario.correo,
        total: pedido.total,
      });

      return acc;
    }, {});

    return Object.entries(ingresosAgrupados).map(([fecha, data]) => ({
      fecha,
      total: data.total,
      pedidos: data.pedidos,
    }));
  },
};
