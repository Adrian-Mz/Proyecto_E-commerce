import React from "react";
import { Routes, Route } from "react-router-dom";
import UserDashboardPage from "./UserDashboardPage";
import UserSettingsPage from "./UserSettingsPage";
import UsuarioPedidosPage from "./UsuarioPedidosPage";
import UsuarioDevolucionesPage from "./UsuarioDevolucionesPage";
import NotFoundPage from "../../components/UI/NotFoundPage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboardPage />}>
        <Route path="profile" element={<UserDashboardPage />} />
        <Route path="settings" element={<UserSettingsPage />} />
        <Route path="orders" element={<UsuarioPedidosPage />} />
        <Route path="returns" element={<UsuarioDevolucionesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
