import api from "./api.config";

export const ReportesAPI = {
  // 🔹 Obtener resumen general
  getResumen: async () => {
    try {
      const response = await api.get("/reportes/resumen");
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo resumen de reportes:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener total de ventas con filtros dinámicos
  getTotalVentas: async (params = {}) => {
    try {
      const response = await api.get("/reportes/ventas/total", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo total de ventas:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener cantidad total de pedidos con filtros
  getTotalPedidos: async (params = {}) => {
    try {
      const response = await api.get("/reportes/ventas/cantidad-pedidos", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo total de pedidos:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener ventas por método de pago con filtros
  getVentasPorMetodoPago: async (params = {}) => {
    try {
      const response = await api.get("/reportes/ventas/por-metodo-pago", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo ventas por método de pago:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener ventas por método de envío con filtros
  getVentasPorMetodoEnvio: async (params = {}) => {
    try {
      const response = await api.get("/reportes/ventas/por-metodo-envio", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo ventas por método de envío:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener ingresos por fecha (día/mes/año) con filtros
  getIngresosPorFecha: async (params = {}) => {
    try {
      const response = await api.get("/reportes/ventas/ingresos-por-fecha", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo ingresos por fecha:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener productos más vendidos con filtros
  getProductosMasVendidos: async (params = {}) => {
    try {
      const response = await api.get("/reportes/productos/mas-vendidos", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo productos más vendidos:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener clientes con más compras con filtros
  getClientesConMasCompras: async (params = {}) => {
    try {
      const response = await api.get("/reportes/clientes/con-mas-compras", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo clientes con más compras:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener total de devoluciones con filtros
  getTotalDevoluciones: async (params = {}) => {
    try {
      const response = await api.get("/reportes/devoluciones/total", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo total de devoluciones:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener ingresos totales por pagos con filtros
  getIngresosTotales: async (params = {}) => {
    try {
      const response = await api.get("/reportes/pagos/ingresos-totales", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo ingresos totales:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener pedidos cancelados con filtros
  getPedidosCancelados: async (params = {}) => {
    try {
      const response = await api.get("/reportes/devoluciones/pedidos-cancelados", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo pedidos cancelados:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener motivos más comunes de devoluciones con filtros
  getMotivosDevoluciones: async (params = {}) => {
    try {
      const response = await api.get("/reportes/devoluciones/motivos-comunes", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo motivos de devoluciones:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener comparación de ingresos anuales con filtros
  getComparacionIngresos: async (params = {}) => {
    try {
      const response = await api.get("/reportes/pagos/comparacion-anual", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo comparación de ingresos anuales:", error.response?.data || error.message);
      return null;
    }
  },

  // 🔹 Obtener productos más vendidos por categoría con filtros
  getProductosMasVendidosPorCategoria: async (categoria, params = {}) => {
    try {
      const url =
        categoria === "Todas"
          ? "/reportes/productos/mas-vendidos"
          : `/reportes/productos/mas-vendidos?categoria=${categoria}`;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo productos más vendidos por categoría:", error);
      return null;
    }
  },

  // 🔹 Obtener categorías más vendidas
  getCategoriasMasVendidas: async (params = {}) => {
    try {
      const response = await api.get("/reportes/productos/categorias-mas-vendidas", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo categorías más vendidas:", error.response?.data || error.message);
      return null;
    }
  },
};
