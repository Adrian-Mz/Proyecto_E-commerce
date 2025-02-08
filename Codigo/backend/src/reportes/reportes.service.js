import { ventasService } from './r.ventas.service.js';
import { productosService } from './r.productos.service.js';
import { clientesService } from './r.clientes.service.js';
import { pagosService } from './r.pagos.service.js';
import { devolucionesService } from './r.devoluciones.service.js';

export const reportesService = {
  async obtenerResumenGeneral() {
    // 🛒 Total de ventas (se obtiene correctamente sin `_sum`)
    const { totalVentas } = await ventasService.totalVentas();

    // 📦 Total de pedidos
    const { totalPedidos } = await ventasService.cantidadPedidos();

    // 🔥 Productos más vendidos (con nombres de productos)
    const productosMasVendidos = await productosService.productosMasVendidos(5);

    // 👥 Total de clientes
    const totalClientes = await clientesService.totalClientes();

    // 💰 Ingresos totales (correctamente formateado)
    const { totalIngresos } = await pagosService.ingresosTotales();

    // 🔄 Cantidad total de devoluciones
    const devolucionesTotales = await devolucionesService.cantidadDevoluciones();

    // 📌 Resumen Final Formateado
    return {
      resumen: {
        totalVentas,
        totalPedidos,
        totalClientes,
        totalIngresos,
        devolucionesTotales,
      },
      productosMasVendidos,
    };
  },
};
