import { PrismaClient } from '@prisma/client';
import { differenceInDays, parseISO } from 'date-fns';

const prisma = new PrismaClient();

export const devolucionesService = {
  // 🔹 Cantidad total de devoluciones
  async cantidadDevoluciones() {
    return await prisma.devoluciones.count();
  },

  // 🔹 Motivos de devolución más comunes con conteo ordenado
  async motivosDevolucionMasComunes() {
    const motivos = await prisma.devolucion_productos.groupBy({
      by: ['motivo'],
      _count: { motivo: true },
      orderBy: { _count: { motivo: 'desc' } },
    });

    return motivos.map(m => ({
      motivo: m.motivo,
      cantidad: m._count.motivo,
    }));
  },

  // 🔹 Cantidad de pedidos cancelados
  async pedidosCancelados() {
    return await prisma.pedidos.count({
      where: { estadoId: 7 }, // Estado 7 = Pedido Cancelado
    });
  },

  // 🔹 Tiempo promedio de resolución de devoluciones en días
  async tiempoPromedioResolucionDevoluciones() {
    const devoluciones = await prisma.devoluciones.findMany({
      where: { fechaResolucion: { not: null } }, // Solo considerar devoluciones resueltas
      select: {
        fechaDevolucion: true,
        fechaResolucion: true,
      },
    });

    if (devoluciones.length === 0) {
      return { mensaje: "No hay devoluciones resueltas para calcular el promedio." };
    }

    const totalDias = devoluciones.reduce((sum, devolucion) => {
      const fechaInicio = devolucion.fechaDevolucion instanceof Date
        ? devolucion.fechaDevolucion
        : parseISO(devolucion.fechaDevolucion.toISOString());

      const fechaFin = devolucion.fechaResolucion instanceof Date
        ? devolucion.fechaResolucion
        : parseISO(devolucion.fechaResolucion.toISOString());

      return sum + differenceInDays(fechaFin, fechaInicio);
    }, 0);

    return {
      promedioDias: (totalDias / devoluciones.length).toFixed(2), // Redondear a 2 decimales
      totalDevolucionesResueltas: devoluciones.length,
    };
  },
};
