import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import UserProfilePage from "./UsuarioPage"; // Página de Perfil
import UserSettingsPage from "./UserSettingsPage"; // Página de Configuración de Usuario

const UserDashboardPage = ({ changeUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Elimina al usuario del almacenamiento local
    changeUser(null); // Limpia el contexto del usuario
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Menú Lateral */}
      <aside className="w-1/4 bg-gray-800 flex flex-col items-center py-6 shadow-lg">
        <div className="mb-6">
          <FaUserCircle size={80} className="text-gray-400" />
        </div>
        <nav className="w-full">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `block py-3 px-6 text-gray-200 hover:bg-gray-700 transition no-underline ${
                isActive ? "bg-gray-700 font-bold" : ""
              }`
            }
          >
            Perfil
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `block py-3 px-6 text-gray-200 hover:bg-gray-700 transition no-underline ${
                isActive ? "bg-gray-700 font-bold" : ""
              }`
            }
          >
            Configuración
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-3 px-6 text-red-500 hover:bg-gray-700 transition"
          >
            <FaSignOutAlt className="inline-block mr-2" />
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6">
        <Routes>
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="settings/*" element={<UserSettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboardPage;
