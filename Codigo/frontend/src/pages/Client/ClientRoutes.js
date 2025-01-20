import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./UserDashboardPage";
import UserSettingsPage from "./UserSettingsPage";
import NotFoundPage from "../../components/UI/NotFoundPage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}>
        <Route path="settings" element={<UserSettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
