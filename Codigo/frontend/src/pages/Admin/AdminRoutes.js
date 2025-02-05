import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./AdminPage";
import GestionProductosPage from "./GestionProductosPage";
import GestionUsuariosPage from "./GestionUsuariosPage";
import GestionCategoriasPage from "./GestionCategoriasPage";
import GestionPromocionesPage from "./GestionPromocionesPage";
import GestionDevolucionesPage from "./GestionDevolucionesPage";
import NotFoundPage from "../../components/UI/NotFoundPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />}>
        <Route path="productos" element={<GestionProductosPage />} />
        <Route path="usuarios" element={<GestionUsuariosPage />} />
        <Route path="categorias" element={<GestionCategoriasPage />} />
        <Route path="promociones" element={<GestionPromocionesPage />} />
        <Route path="devoluciones" element={<GestionDevolucionesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
