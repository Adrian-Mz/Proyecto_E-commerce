import { PrismaClient } from '@prisma/client';
import { differenceInDays, parseISO } from 'date-fns';

const prisma = new PrismaClient();

export const devolucionesService = {
  // 🔹 Cantidad total de devoluciones con filtro opcional por fecha
  async cantidadDevoluciones({ fechaInicio = null, fechaFin = null } = {}) {
    const where = {
      ...(fechaInicio && fechaFin && {
        fechaDevolucion: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    return await prisma.devoluciones.count({ where });
  },

  // 🔹 Motivos de devolución más comunes con conteo ordenado y filtro opcional por fecha
  async motivosDevolucionMasComunes({ fechaInicio = null, fechaFin = null } = {}) {
    const where = {
      ...(fechaInicio && fechaFin && {
        devolucion: { fechaDevolucion: { gte: new Date(fechaInicio), lte: new Date(fechaFin) } },
      }),
    };

    const motivos = await prisma.devolucion_productos.groupBy({
      by: ['motivo'],
      _count: { motivo: true },
      where,
      orderBy: { _count: { motivo: 'desc' } },
    });

    return motivos.map(m => ({
      motivo: m.motivo,
      cantidad: m._count.motivo,
    }));
  },

  // 🔹 Cantidad de pedidos cancelados con filtro opcional por fecha
  async pedidosCancelados({ fechaInicio = null, fechaFin = null } = {}) {
    const where = {
      estadoId: 7, // Estado 7 = Pedido Cancelado
      ...(fechaInicio && fechaFin && {
        fechaPedido: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    return await prisma.pedidos.count({ where });
  },

  // 🔹 Tiempo promedio de resolución de devoluciones en días con filtro opcional por fecha
  async tiempoPromedioResolucionDevoluciones({ fechaInicio = null, fechaFin = null } = {}) {
    const where = {
      fechaResolucion: { not: null }, // Solo considerar devoluciones resueltas
      ...(fechaInicio && fechaFin && {
        fechaDevolucion: { gte: new Date(fechaInicio), lte: new Date(fechaFin) },
      }),
    };

    const devoluciones = await prisma.devoluciones.findMany({
      where,
      select: {
        fechaDevolucion: true,
        fechaResolucion: true,
      },
    });

    if (devoluciones.length === 0) {
      return { mensaje: "No hay devoluciones resueltas para calcular el promedio." };
    }

    const totalDias = devoluciones.reduce((sum, devolucion) => {
      const fechaInicio = parseISO(devolucion.fechaDevolucion.toISOString());
      const fechaFin = parseISO(devolucion.fechaResolucion.toISOString());

      return sum + differenceInDays(fechaFin, fechaInicio);
    }, 0);

    return {
      promedioDias: (totalDias / devoluciones.length).toFixed(2), // Redondear a 2 decimales
      totalDevolucionesResueltas: devoluciones.length,
    };
  },
};
