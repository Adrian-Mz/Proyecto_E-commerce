import { ReportsData } from './reports.data.js';

export const ReportsService = {
  async getReporteCompleto() {
    try {
      const data = await ReportsData.getReporteCompleto();

      // 🔹 Formatear las ventas
      const ventas = data.ventas.map((venta) => ({
        pedidoId: venta.id,
        usuario: `${venta.usuario.nombre} ${venta.usuario.apellido}`,
        correo: venta.usuario.correo,
        fechaPedido: venta.fechaPedido,
        total: venta.total,
        metodoPago: venta.metodoPago.nombre,
        metodoEnvio: venta.metodoEnvio.nombre,
        productos: venta.productos.map((p) => ({
          nombre: p.producto.nombre,
          marca: p.producto.marca,
          precioBase: p.producto.precioBase,
          iva: p.producto.ivaPorcentaje,
        })),
      }));

      // 🔹 Formatear productos más vendidos
      const productosVendidos = data.productosVendidos.map((p) => {
        const detalles = data.productosDetalles.find((prod) => prod.id === p.productoId);
        return {
          productoId: p.productoId,
          nombre: detalles?.nombre || "Desconocido",
          marca: detalles?.marca || "Desconocida",
          cantidadVendida: p._sum?.cantidad || 0,
          totalRecaudado: (detalles?.precioBase || 0) * (p._sum?.cantidad || 0),
        };
      });

      // 🔹 Formatear devoluciones
      const devoluciones = data.devoluciones.map((d) => ({
        pedidoId: d.pedido.id,
        productoNombre: d.producto.nombre,
        cantidad: d.cantidad,
        estado: d.estado.nombre,
        montoReembolsado: d.montoReembolsado,
      }));

      // 🔹 Formatear usuarios registrados
      const usuarios = data.usuarios.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo,
        fechaRegistro: u.fechaRegistro,
      }));

      return {
        ventas,
        productosVendidos,
        devoluciones,
        usuarios,
        ingresos: data.ingresos,
        conteos: data.conteos, // 🔹 Agregamos los conteos de cada tabla
      };
    } catch (error) {
      throw new Error("Error en la lógica de negocio: " + error.message);
    }
  },
};
