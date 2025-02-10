import { ReportesAPI } from "../../api/api.reportes";

export const getUserDashboardMetrics = async () => {
  try {
    const reporte = await ReportesAPI.getGeneral(); 

    if (!reporte) throw new Error("No se obtuvieron datos del reporte");

    console.log("📊 Datos obtenidos del backend (Usuarios):", reporte);

    return {
      totalPedidos: reporte.conteos?.totalPedidos || 0,
      totalProductosVendidos: reporte.conteos?.totalProductos || 0,
      totalDevoluciones: reporte.conteos?.totalDevoluciones || 0,

      productosMasVendidos: reporte.productosVendidos.map((p) => ({
        nombre: p.nombre,
        cantidadVendida: p.cantidadVendida,
        marca: p.marca,
      })),

      pedidosPorMetodoPago: reporte.ventas.reduce((acc, v) => {
        acc[v.metodoPago] = (acc[v.metodoPago] || 0) + 1;
        return acc;
      }, {}),

      pedidosPorMetodoEnvio: reporte.ventas.reduce((acc, v) => {
        acc[v.metodoEnvio] = (acc[v.metodoEnvio] || 0) + 1;
        return acc;
      }, {}),
    };
  } catch (error) {
    console.error("❌ Error obteniendo métricas del Dashboard para Usuarios:", error);
    return null;
  }
};
