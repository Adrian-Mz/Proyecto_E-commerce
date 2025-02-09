import { ReportsData } from "./reports.data.js";

export const ReportsService = {
  async getReporteVentas(filters) {
    const ventas = await ReportsData.getVentas(filters);

    return ventas.map((venta) => ({
      pedidoId: venta.id,
      usuario: `${venta.usuario.nombre} ${venta.usuario.apellido}`,
      correo: venta.usuario.correo,
      fechaPedido: venta.fechaPedido,
      total: venta.total,
      productos: venta.productos.map((p) => ({
        nombre: p.producto.nombre,
        marca: p.producto.marca,
        precioBase: p.producto.precioBase,
        iva: p.producto.ivaPorcentaje,
      })),
    }));
  },

  async getReporteProductosMasVendidos(filters) {
    const productos = await ReportsData.getProductosMasVendidos(filters);
    
    return productos.map((p) => ({
      producto: p.detalles?.nombre || "Desconocido",
      marca: p.detalles?.marca || "Desconocida",
      cantidadVendida: p.cantidadVendida,
      totalRecaudado: (p.detalles?.precioBase || 0) * p.cantidadVendida, // 🔹 Se multiplica manualmente
      precioBase: p.detalles?.precioBase || 0,
      iva: p.detalles?.ivaPorcentaje || 0
    }));
  },
  
  async getReporteGeneral(filters) {
    const [cantidadPedidos, devoluciones, usuarios, ingresosNetos] = await Promise.all([
      ReportsData.getCantidadPedidos(filters),
      ReportsData.getDevoluciones(filters),
      ReportsData.getUsuariosRegistrados(filters),
      ReportsData.getIngresosNetos(filters),
    ]);

    return {
      cantidadPedidos,
      devoluciones: devoluciones.length,
      usuariosRegistrados: usuarios.length,
      ingresosNetos,
    };
  },
};
