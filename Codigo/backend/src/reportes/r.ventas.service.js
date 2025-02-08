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

  // 🔹 Ventas agrupadas por método de pago con detalles
  async ventasPorMetodoPago() {
    const resultado = await prisma.pedidos.groupBy({
      by: ['metodoPagoId'],
      _count: { metodoPagoId: true },
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

  // 🔹 Ventas agrupadas por método de envío con detalles
  async ventasPorMetodoEnvio() {
    const resultado = await prisma.pedidos.groupBy({
      by: ['metodoEnvioId'],
      _count: { metodoEnvioId: true },
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

  // 🔹 Ingresos agrupados por fecha con detalles de pedidos
  async ingresosPorFecha(agrupacion = 'month') {
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
