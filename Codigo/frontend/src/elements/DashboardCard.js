import React from "react";

const DashboardCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div 
      className={`p-6 rounded-lg shadow-lg ${color} flex items-center justify-between cursor-pointer transition-transform transform hover:scale-105`}
      onClick={onClick} // 📌 Acción opcional si se necesita clic
    >
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-3xl font-bold mt-2 text-gray-200">
          {value ?? "No disponible"} {/* 📌 Manejo de valores nulos */}
        </p>
      </div>
      <span className="text-5xl text-white">{icon}</span> {/* 📌 Icono más adaptable */}
    </div>
  );
};

export default DashboardCard;
