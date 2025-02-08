import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export const ventasService = {
  // 🔹 Total de ventas (solo pedidos completados)
  async totalVentas() {
    const resultado = await prisma.pedidos.aggregate({
      _sum: { total: true },
      where: { estadoId: 4 }, // Solo pedidos en estado "Entregado"
    });

    return { totalVentas: resultado._sum.total || 0 };
  },

  // 🔹 Cantidad total de pedidos
  async cantidadPedidos() {
    const resultado = await prisma.pedidos.count();
    return { totalPedidos: resultado };
  },

  // 🔹 Ventas agrupadas por método de pago
  async ventasPorMetodoPago() {
    const resultado = await prisma.pedidos.groupBy({
      by: ['metodoPagoId'],
      _count: { metodoPagoId: true },
      orderBy: { _count: { metodoPagoId: 'desc' } },
    });

    return resultado.map(m => ({
      metodoPagoId: m.metodoPagoId,
      cantidad: m._count.metodoPagoId,
    }));
  },

  // 🔹 Ventas agrupadas por método de envío
  async ventasPorMetodoEnvio() {
    const resultado = await prisma.pedidos.groupBy({
      by: ['metodoEnvioId'],
      _count: { metodoEnvioId: true },
      orderBy: { _count: { metodoEnvioId: 'desc' } },
    });

    return resultado.map(m => ({
      metodoEnvioId: m.metodoEnvioId,
      cantidad: m._count.metodoEnvioId,
    }));
  },

  // 🔹 Ingresos agrupados por fecha (por día, mes o año)
  async ingresosPorFecha(agrupacion = 'month') {
    const resultado = await prisma.pedidos.findMany({
      select: {
        fechaPedido: true,
        total: true,
      },
      where: { estadoId: 4 },
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
        acc[claveFecha] = 0;
      }
      acc[claveFecha] += Number(pedido.total);

      return acc;
    }, {});

    return Object.entries(ingresosAgrupados).map(([fecha, total]) => ({ fecha, total }));
  },
};
