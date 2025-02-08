import { ReportesAPI } from "../../api/api.reportes";
import { CategoriasService } from "../../api/api.categorias";

export const getDashboardMetrics = async (filtros) => {
  try {
    const { agrupacion, categoriaId } = filtros;
    const params = {
      agrupacion,
      fechaInicio: "2024-01-01", // Puedes reemplazarlo con un rango dinámico
      fechaFin: "2025-12-31",
      categoriaId: categoriaId !== "Todas" ? categoriaId : null,
    };

    // 📌 Obtener datos desde la API con filtros aplicados
    const [
      resumen,
      pedidosCancelados,
      motivosDevoluciones,
      comparacionIngresos,
      productosMasVendidos,
      ventasPorMetodoPago,
      ventasPorMetodoEnvio,
      ingresosTotales,
      clientesConMasCompras,
      categorias,
    ] = await Promise.all([
      ReportesAPI.getResumen(),
      ReportesAPI.getPedidosCancelados(params),
      ReportesAPI.getMotivosDevoluciones(params),
      ReportesAPI.getIngresosPorFecha(params),
      ReportesAPI.getProductosMasVendidos(params),
      ReportesAPI.getVentasPorMetodoPago(params),
      ReportesAPI.getVentasPorMetodoEnvio(params),
      ReportesAPI.getIngresosTotales(params),
      ReportesAPI.getClientesConMasCompras(params),
      CategoriasService.getCategorias(),
    ]);

    console.log("📊 Datos obtenidos del backend:", {
      resumen,
      pedidosCancelados,
      motivosDevoluciones,
      comparacionIngresos,
      productosMasVendidos,
      ventasPorMetodoPago,
      ventasPorMetodoEnvio,
      ingresosTotales,
      clientesConMasCompras,
      categorias,
    });

    return {
      totalVentas: resumen?.resumen?.totalVentas || "0",
      totalPedidos: resumen?.resumen?.totalPedidos || 0,
      productosMasVendidos: productosMasVendidos || [],
      totalClientes: resumen?.resumen?.totalClientes?.totalClientes || "0",
      ingresosTotales: ingresosTotales?.totalIngresos || "0",
      totalDevoluciones: resumen?.resumen?.devolucionesTotales || 0,
      pedidosCancelados: pedidosCancelados || 0,
      motivosDevoluciones: motivosDevoluciones || [],
      comparacionIngresos: comparacionIngresos || [],
      ventasPorMetodoPago: ventasPorMetodoPago || [],
      ventasPorMetodoEnvio: ventasPorMetodoEnvio || [],
      clientesConMasCompras: clientesConMasCompras || [],
      categorias: categorias || [],
    };
  } catch (error) {
    console.error("❌ Error obteniendo métricas del Dashboard:", error);
    return null;
  }
};
