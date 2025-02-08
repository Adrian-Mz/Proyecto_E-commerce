import React from "react";
import { 
  Bar, Line, Pie, Doughnut, Radar, PolarArea 
} from "react-chartjs-2";
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, 
  ArcElement, PointElement, LineElement, RadialLinearScale
} from "chart.js";

// 📌 Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, 
  ArcElement, PointElement, LineElement, RadialLinearScale
);

const DashboardChart = ({ title, type, data }) => {

  // ✅ Verificar si hay datos
  if (!data || !data.labels || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg flex justify-center items-center h-40">
        <p className="text-gray-500">❌ No hay datos suficientes para mostrar el gráfico.</p>
      </div>
    );
  }

  // 📌 Definir los tipos de gráficos permitidos
  const chartTypes = {
    line: <Line data={data} />,
    bar: <Bar data={data} />,
    pie: <Pie data={data} />,
    doughnut: <Doughnut data={data} />,
    radar: <Radar data={data} />,
    polarArea: <PolarArea data={data} />
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      {chartTypes[type] || (
        <p className="text-red-500">⚠️ Tipo de gráfico no válido: "{type}"</p>
      )}
    </div>
  );
};

export default DashboardChart;
