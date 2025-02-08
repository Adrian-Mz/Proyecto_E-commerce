import { PrismaClient } from '@prisma/client';
import { format, getYear } from 'date-fns';

const prisma = new PrismaClient();

export const pagosService = {
  // 🔹 Ingresos Totales
  async ingresosTotales() {
    const result = await prisma.pagos.aggregate({
      _sum: { monto: true },
    });

    return {
      totalIngresos: result._sum.monto || 0,
    };
  },

  // 🔹 Pagos por Método (Mostrando el nombre del método y cantidad)
  async pagosPorMetodo() {
    const pagos = await prisma.pagos.groupBy({
      by: ['metodoPagoId'],
      _count: { metodoPagoId: true },
    });

    // Obtener los nombres de los métodos de pago
    const metodosPago = await prisma.metodo_pago.findMany({
      select: { id: true, nombre: true },
    });

    // Mapear los resultados para mostrar el nombre del método de pago en lugar del ID
    return pagos.map(pago => {
      const metodo = metodosPago.find(m => m.id === pago.metodoPagoId);
      return {
        metodoPago: metodo ? metodo.nombre : `ID: ${pago.metodoPagoId}`,
        cantidadPagos: pago._count.metodoPagoId,
      };
    });
  },

  // 🔹 Comparación de Ingresos Anuales
  async comparacionIngresosAnuales() {
    const pagos = await prisma.pagos.findMany({
      select: {
        fechaPago: true,
        monto: true,
      },
    });

    if (pagos.length === 0) {
      return { mensaje: "No hay datos suficientes para comparación anual." };
    }

    // Agrupar por año
    const ingresosPorAnio = pagos.reduce((acc, pago) => {
      const year = getYear(new Date(pago.fechaPago));
      if (!acc[year]) acc[year] = 0;
      acc[year] += Number(pago.monto);
      return acc;
    }, {});

    return Object.keys(ingresosPorAnio).map(year => ({
      año: year,
      ingresos: ingresosPorAnio[year].toFixed(2),
    }));
  },
};
