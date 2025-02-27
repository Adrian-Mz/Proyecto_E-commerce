import React from "react";
import { Routes, Route, NavLink} from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaKey, FaRegThumbsDown  } from "react-icons/fa";
import UserProfilePage from "./UsuarioPage"; // Página de Perfil
import UserSettingsPage from "./UserSettingsPage"; // Página de Configuración de Usuario
import UsuarioPedidosPage from "./UsuarioPedidosPage";
import UsuarioDevolucionesPage from "./UsuarioDevolucionesPage";

const UserDashboardPage = ({ changeUser }) => {
  const storedUser = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Menú Lateral */}
      <aside className="w-1/4 bg-white text-gray-900 flex flex-col items-center py-6 shadow-lg">
        <div className="mb-6">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-900">
            {storedUser?.nombre?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
        <p className="text-center text-lg font-bold">{storedUser?.nombre || "Usuario"}</p>
        <nav className="w-full mt-6">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `block py-3 px-6 hover:bg-gray-200 hover:shadow-md transition rounded-lg no-underline  ${
                isActive ? "bg-gray-100 font-bold shadow-md" : "text-gray-900"
              }`
            }
            
          >
            <FaUserCircle className="inline-block mr-2" />
            Perfil
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `block py-3 px-6 hover:bg-gray-200 hover:shadow-md transition rounded-lg no-underline  ${
                isActive ? "bg-gray-100 font-bold shadow-md" : "text-gray-900"
              }`
            }
          >
            <FaKey className="inline-block mr-2" />
            Configuración
          </NavLink>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) =>
              `block py-3 px-6 hover:bg-gray-200 hover:shadow-md transition rounded-lg no-underline ${
                isActive ? "bg-gray-100 font-bold shadow-md" : "text-gray-900"
              }`
            }
          >
            <FaShoppingCart className="inline-block mr-2" />
            Mis Pedidos
          </NavLink>

          <NavLink
            to="/dashboard/returns"
            className={({ isActive }) =>
              `block py-3 px-6 hover:bg-gray-200 hover:shadow-md transition rounded-lg no-underline ${
                isActive ? "bg-gray-100 font-bold shadow-md" : "text-gray-900"
              }`
            }
          >
            <FaRegThumbsDown className="inline-block mr-2" />
            Devoluciones
          </NavLink>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6">
        <div className="bg-gray-900 text-gray-100 p-6 rounded-md shadow-md mb-6">
          <h1 className="text-2xl font-bold">Bienvenido, {storedUser?.nombre || "Usuario"}!</h1>
          <p className="text-gray-300 mt-2">
            Aquí puedes actualizar tu perfil, configuración de cuenta, ver tus pedidos y gestionar tus devoluciones.
          </p>
        </div>
        <Routes>
          <Route index element={<UserProfilePage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="settings" element={<UserSettingsPage />} />
          <Route path="orders" element={<UsuarioPedidosPage />} />
          <Route path="returns" element={<UsuarioDevolucionesPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboardPage;
