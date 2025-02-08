import { ventasService } from './r.ventas.service.js';
import { productosService } from './r.productos.service.js';
import { clientesService } from './r.clientes.service.js';
import { pagosService } from './r.pagos.service.js';
import { devolucionesService } from './r.devoluciones.service.js';

export const reportesService = {
  async obtenerResumenGeneral() {
    // 🛒 Total de ventas (aseguramos el valor correcto)
    const totalVentas = await ventasService.totalVentas();
    const totalVentasFormatted = totalVentas._sum.total || 0;

    // 📦 Total de pedidos
    const totalPedidos = await ventasService.cantidadPedidos();

    // 🔥 Productos más vendidos (incluyendo nombre del producto)
    const productosMasVendidos = await productosService.productosMasVendidos();
    const productosConNombres = await Promise.all(
      productosMasVendidos.map(async (producto) => {
        const productoInfo = await productosService.obtenerProductoPorId(producto.productoId);
        return {
          id: producto.productoId,
          nombre: productoInfo?.nombre || 'Desconocido',
          cantidadVendida: producto._sum.cantidad,
        };
      })
    );

    // 👥 Total de clientes
    const totalClientes = await clientesService.totalClientes();

    // 💰 Ingresos totales (asegurar correcta lectura)
    const ingresosTotales = await pagosService.ingresosTotales();
    const ingresosFormatted = ingresosTotales._sum.monto || 0;

    // 🔄 Cantidad de devoluciones
    const devolucionesTotales = await devolucionesService.cantidadDevoluciones();

    return {
      totalVentas: totalVentasFormatted,
      totalPedidos,
      productosMasVendidos: productosConNombres,
      totalClientes,
      ingresosTotales: ingresosFormatted,
      devolucionesTotales,
    };
  },
};
