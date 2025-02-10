import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ReporteData = {
  async obtenerDatosReporte() {
    try {
      // Obtener todas las ventas con la relación correcta a productos
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

      // Obtener ingresos totales
      const ingresosBrutos = await prisma.pedidos.aggregate({ _sum: { total: true } });

      return {
        ventas,
        ingresos: {
          brutos: ingresosBrutos._sum.total || 0
        }
      };
    } catch (error) {
      throw new Error("Error al obtener los datos completos: " + error.message);
    }
  },
};
