import React, { useEffect, useState } from "react";
import { getDashboardMetrics } from "./dashboardCalculation";
import DashboardCard from "../../elements/DashboardCard";
import DashboardChart from "../../elements/DashboardChart";

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalVentas: "0",
    totalPedidos: 0,
    productosMasVendidos: [],
    totalClientes: 0,
    ingresosTotales: "0",
    totalDevoluciones: 0,
    motivosDevoluciones: [],
    comparacionIngresos: [],
    ventasPorMetodoPago: [],
    ventasPorMetodoEnvio: [],
    clientesConMasCompras: [],
    categorias: [],
  });

  const [filtroFecha, setFiltroFecha] = useState("month");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  useEffect(() => {
    const fetchMetrics = async () => {
      const filtros = { agrupacion: filtroFecha, categoriaId: categoriaSeleccionada };
      const metrics = await getDashboardMetrics(filtros);
      if (metrics) {
        setData(metrics);
      }
    };

    fetchMetrics();
  }, [filtroFecha, categoriaSeleccionada]);


  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard Administrativo</h1>

      {/* 📌 Sección: Resumen General */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📌 Resumen General</h2>
      <div className="grid grid-cols-5 gap-6">
        <DashboardCard title="Total de Ventas" value={`$${data.totalVentas}`}color="bg-blue-500" />
        <DashboardCard title="Total de Ingresos" value={`$${data.ingresosTotales}`} color="bg-yellow-500" />
        <DashboardCard title="Total de Pedidos" value={`${data.totalPedidos}`} color="bg-green-500" />
        <DashboardCard title="Total de Clientes" value={`${data.totalClientes || 0}`} color="bg-purple-500" />
        <DashboardCard title="Total de Devoluciones" value={`${data.totalDevoluciones}`}color="bg-red-500" />
      </div>

      {/* 📌 Sección: Resumen Específico */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">📊 Resumen Específico</h2>

      {/* 📌 Filtros */}
 {/* 📌 Filtros */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <label className="font-semibold text-gray-800">📅 Filtrar por:</label>
          <select
            className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          >
            <option value="day">Día</option>
            <option value="month">Mes</option>
            <option value="year">Año</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold text-gray-800">📦 Categoría:</label>
          <select
            className="p-2 border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {data.categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 📈 Ventas Mensuales */}
        <DashboardChart
          title="Ventas Mensuales"
          type="line"
          data={{
            labels: data.comparacionIngresos.map((d) => d.fecha),
            datasets: [
              {
                label: "Ingresos Totales",
                data: data.comparacionIngresos.map((d) => d.total),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
            ],
          }}
        />

        {/* 🏆 Productos Más Vendidos */}
        <DashboardChart
          title="Productos Más Vendidos"
          type="doughnut"
          data={{
            labels: data.productosMasVendidos.map((p) => p.categoria),
            datasets: [
              {
                label: "Cantidad Vendida",
                data: data.productosMasVendidos.map((p) => p.cantidadVendida),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            ],
          }}
        />

        {/* 🔄 Motivos de Devoluciones */}
        <DashboardChart
          title="Motivos Más Comunes de Devoluciones"
          type="pie"
          data={{
            labels: data.motivosDevoluciones.map((m) => m.motivo),
            datasets: [
              {
                data: data.motivosDevoluciones.map((m) => m.cantidad),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          }}
        />

        {/* 💳 Ventas por Método de Pago */}
        <DashboardChart
          title="Ventas por Método de Pago"
          type="doughnut"
          data={{
            labels: data.ventasPorMetodoPago.map((m) => m.metodoPago),
            datasets: [
              {
                label: "Cantidad de Ventas",
                data: data.ventasPorMetodoPago.map((m) => m.cantidad),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          }}
        />

        {/* 🚚 Ventas por Método de Envío */}
        <DashboardChart
          title="Ventas por Método de Envío"
          type="bar"
          data={{
            labels: data.ventasPorMetodoEnvio.map((m) => m.metodoEnvio),
            datasets: [
              {
                label: "Cantidad de Ventas",
                data: data.ventasPorMetodoEnvio.map((m) => m.cantidad),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 2,
              },
            ],
          }}
        />

        {/* 👥 Clientes con Más Compras */}
        <DashboardChart
          title="Clientes con Más Compras"
          type="bar"
          data={{
            labels: data.clientesConMasCompras.map((c) => `${c.nombre} ${c.apellido}`),
            datasets: [
              {
                label: "Cantidad de Compras",
                data: data.clientesConMasCompras.map((c) => c.cantidadPedidos),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
