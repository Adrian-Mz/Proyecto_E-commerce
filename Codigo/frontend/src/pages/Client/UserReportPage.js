import React, { useEffect, useState } from "react";
import { getUserDashboardMetrics } from "./dashboardUserCalculation";
import DashboardCard from "../../elements/DashboardCard";
import DashboardChart from "../../elements/DashboardChart";

const UserReportPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getUserDashboardMetrics();
      if (metrics) {
        setData(metrics);
      }
    };
    fetchMetrics();
  }, []);


  if (!data) {
    return <div className="text-center text-gray-700 text-lg">Cargando datos del Reporte...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Reporte General</h1>

      {/* 📌 Resumen General */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📌 Resumen General</h2>
      <div className="grid grid-cols-3 gap-6">
        <DashboardCard title="Total de Pedidos" value={`${data.totalPedidos}`} color="bg-green-500" />
        <DashboardCard title="Total de Productos Vendidos" value={`${data.totalProductosVendidos}`} color="bg-blue-500" />
        <DashboardCard title="Total de Devoluciones" value={`${data.totalDevoluciones}`} color="bg-red-500" />
      </div>

      {/* 📊 Sección de Gráficos */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">📊 Análisis Visual</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* 📈 Pedidos por Método de Pago */}
        <DashboardChart
          title="Pedidos por Método de Pago"
          type="pie"
          data={{
            labels: Object.keys(data.pedidosPorMetodoPago),
            datasets: [
              {
                data: Object.values(data.pedidosPorMetodoPago),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          }}
        />

        {/* 🚚 Pedidos por Método de Envío */}
        <DashboardChart
          title="Pedidos por Método de Envío"
          type="doughnut"
          data={{
            labels: Object.keys(data.pedidosPorMetodoEnvio),
            datasets: [
              {
                data: Object.values(data.pedidosPorMetodoEnvio),
                backgroundColor: ["#4CAF50", "#FF5722", "#FFCE56"],
              },
            ],
          }}
        />

        <DashboardChart
          title="Productos más Vendidos"
          type="pie"
          data={{
            labels: Object.values(data.productosMasVendidos).map((p) => p.nombre),
            datasets: [
              {
                label: data.productosMasVendidos.nombre,
                data: Object.values(data.productosMasVendidos).map((p) => p.cantidadVendida),
                backgroundColor: ["#4CAF50", "#FF5722", "#FFCE56"],
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default UserReportPage;
