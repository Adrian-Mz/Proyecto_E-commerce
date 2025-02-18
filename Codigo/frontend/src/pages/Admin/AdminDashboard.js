import React, { useEffect, useState } from "react";
import { getDashboardMetrics } from "./dashboardCalculation";
import DashboardCard from "../../elements/DashboardCard";
import DashboardChart from "../../elements/DashboardChart";
import { ReportesAPI } from "../../api/api.reportes";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getDashboardMetrics();
      if (metrics) {
        setData(metrics);
      }
    };
    fetchMetrics();
  }, []);

  if (!data) {
    return <div className="text-center text-gray-700 text-lg">Cargando datos del Dashboard...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard Administrativo</h1>

      <div className="mb-4">
        <button
          onClick={ReportesAPI.descargarReporte}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          📥 Descargar Reporte General
        </button>
      </div>

      {/* 📌 Resumen General */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📌 Resumen General</h2>
      <div className="grid grid-cols-5 gap-6">
        <DashboardCard title="Total de Ventas" value={`$${data.totalVentas}`} color="bg-blue-500" />
        <DashboardCard title="Total de Ingresos" value={`$${data.ingresosTotales}`} color="bg-yellow-500" />
        <DashboardCard title="Total de Pedidos" value={`${data.totalPedidos}`} color="bg-green-500" />
        <DashboardCard title="Total de Clientes" value={`${data.totalClientes}`} color="bg-purple-500" />
        <DashboardCard title="Total de Devoluciones" value={`${data.totalDevoluciones}`} color="bg-red-500" />
      </div>

      {/* 📊 Sección de Gráficos */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">📊 Análisis Visual</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* 📈 Evolución de Ingresos por Fecha */}
        <DashboardChart
          title="Evolución de Ingresos por Fecha"
          type="line"
          data={{
            labels: data.ingresosPorFecha.map(d => d.fecha),
            datasets: [
              {
                label: "Ingresos",
                data: data.ingresosPorFecha.map(d => d.total),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              }
            ],
          }}
        />

        {/* 🏷 Cantidad de Productos Vendidos por Marca */}
        <DashboardChart
          title="Cantidad de Productos Vendidos por Marca"
          type="bar"
          data={{
            labels: Object.keys(data.ventasPorMarca),
            datasets: [
              {
                label: "Cantidad Vendida",
                data: Object.values(data.ventasPorMarca),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              }
            ],
          }}
        />

        {/* 💰 Comparación de Ingresos */}
        <DashboardChart
          title="Comparación de Ingresos"
          type="bar"
          data={{
            labels: data.comparacionIngresos.map(c => c.tipo),
            datasets: [
              {
                label: "Monto",
                data: data.comparacionIngresos.map(c => c.valor),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
              }
            ],
          }}
        />

        {/* 🔄 Relación Pedidos vs. Devoluciones */}
        <DashboardChart
          title="Pedidos vs. Devoluciones"
          type="pie"
          data={{
            labels: data.pedidosVsDevoluciones.map(d => d.tipo),
            datasets: [
              {
                data: data.pedidosVsDevoluciones.map(d => d.cantidad),
                backgroundColor: ["#4CAF50", "#FF5722"],
              }
            ],
          }}
        />

        {/* 🏷 Distribución de Productos Vendidos por Marca */}
        <DashboardChart
          title="Distribución de Ventas por Marca"
          type="doughnut"
          data={{
            labels: Object.keys(data.ventasPorMarca),
            datasets: [
              {
                data: Object.values(data.ventasPorMarca),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
              }
            ],
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;