import { ReportesAPI } from "../../api/api.reportes";

export const getDashboardMetrics = async () => {
  try {
    const reporte = await ReportesAPI.getGeneral(); // 🔹 Asegúrate de que esta función existe en api.reportes.js

    if (!reporte) throw new Error("No se obtuvieron datos del reporte");

    console.log("📊 Datos obtenidos del backend:", reporte);

    return {
      totalVentas: parseFloat(reporte.ingresos?.brutos) || 0,
      totalPedidos: reporte.conteos?.totalPedidos || 0,
      totalClientes: reporte.conteos?.totalUsuarios || 0,
      ingresosTotales: parseFloat(reporte.ingresos?.netos) || 0,
      totalDevoluciones: reporte.conteos?.totalDevoluciones || 0,

      productosMasVendidos: reporte.productosVendidos || [],
      devoluciones: reporte.devoluciones || [],
      ventas: reporte.ventas || [],
      usuarios: reporte.usuarios || [],

      // 📊 Datos para nuevos gráficos
      ingresosPorFecha: reporte.ventas.map(v => ({
        fecha: new Date(v.fechaPedido).toLocaleDateString("es-ES"),
        total: parseFloat(v.total),
      })),

      ventasPorMarca: reporte.productosVendidos.reduce((acc, p) => {
        acc[p.marca] = (acc[p.marca] || 0) + p.cantidadVendida;
        return acc;
      }, {}),

      comparacionIngresos: [
        { tipo: "Brutos", valor: parseFloat(reporte.ingresos?.brutos || 0) },
        { tipo: "Netos", valor: parseFloat(reporte.ingresos?.netos || 0) },
        { tipo: "Descuentos", valor: parseFloat(reporte.ingresos?.descuentos || 0) },
        { tipo: "Devoluciones", valor: parseFloat(reporte.ingresos?.devoluciones || 0) }
      ],

      pedidosVsDevoluciones: [
        { tipo: "Pedidos", cantidad: reporte.conteos?.totalPedidos || 0 },
        { tipo: "Devoluciones", cantidad: reporte.conteos?.totalDevoluciones || 0 }
      ],
    };
  } catch (error) {
    console.error("❌ Error obteniendo métricas del Dashboard:", error);
    return null;
  }
};
