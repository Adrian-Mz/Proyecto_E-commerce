import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ReporteData = {
  async obtenerDatosReporte() {
    try {
      console.log("Obteniendo datos para el reporte...");

      const [ventas, devoluciones, ingresosBrutos, devolucionesTotal, descuentosTotal] = await Promise.all([
        prisma.pedidos.findMany({
          include: {
            usuario: { select: { nombre: true, apellido: true, correo: true } },
            productos: {
              include: {
                producto: { select: { nombre: true, precioBase: true, ivaPorcentaje: true, promocionId: true } },
              },
            },
            metodoPago: { select: { nombre: true } },
            metodoEnvio: { select: { nombre: true, costo: true } },
          },
          orderBy: { fechaPedido: "desc" },
        }),

        prisma.devoluciones.findMany({
          include: {
            pedido: { select: { usuario: { select: { nombre: true, apellido: true } } } },
            producto: { select: { nombre: true, precioBase: true, ivaPorcentaje: true } }, // Incluye IVA
            estado: { select: { nombre: true } },
          },
          orderBy: { fechaDevolucion: "desc" },
        }),

        prisma.pedidos.aggregate({ _sum: { total: true } }),

        prisma.devoluciones.aggregate({ _sum: { montoReembolsado: true } }),

        prisma.pedido_productos.aggregate({
          _sum: { precio_unitario: true },
          where: { producto: { promocionId: { not: null } } },
        }),
      ]);

      // 🔹 Validaciones para evitar errores si la base de datos está vacía
      const ingresosBrutosValidos = ingresosBrutos._sum.total ? parseFloat(ingresosBrutos._sum.total) : 0;
      const devolucionesTotales = devolucionesTotal._sum.montoReembolsado ? parseFloat(devolucionesTotal._sum.montoReembolsado) : 0;
      const descuentosValidos = descuentosTotal._sum.precio_unitario ? parseFloat(descuentosTotal._sum.precio_unitario) : 0;

      // 🔹 Cálculo correcto del **IVA total**
      let totalIVA = 0;
      ventas.forEach((venta) => {
        venta.productos.forEach((p) => {
          const precioBase = parseFloat(p.producto.precioBase) || 0;
          const ivaPorcentaje = parseFloat(p.producto.ivaPorcentaje) || 0;
          const cantidad = p.cantidad || 1;
          totalIVA += (precioBase * (ivaPorcentaje / 100)) * cantidad;
        });
      });

      // 🔹 Cálculo correcto de ingresos netos
      const ingresosNetos = ingresosBrutosValidos - devolucionesTotales - descuentosValidos - totalIVA;

      console.log("Datos obtenidos correctamente.");
      return {
        ventas,
        devoluciones,
        ingresos: {
          brutos: ingresosBrutosValidos,
          devoluciones: devolucionesTotales,
          descuentos: descuentosValidos,
          iva: totalIVA, // 🔹 IVA total calculado correctamente
          neto: ingresosNetos, // 🔹 Ahora descuenta también el IVA
        },
      };
    } catch (error) {
      console.error("Error en obtenerDatosReporte:", error);
      throw new Error("Error al obtener los datos completos: " + error.message);
    }
  },
};
