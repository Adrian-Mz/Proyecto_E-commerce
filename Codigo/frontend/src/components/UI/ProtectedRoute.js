import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ role, Component }) => {
  const storedUser = localStorage.getItem("usuario");
  if (!storedUser) {
    return <Navigate to="/login" />;
  }

  const usuario = JSON.parse(storedUser);
  const decodedToken = jwtDecode(usuario.token);

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("usuario");
    return <Navigate to="/login" />;
  }

  if (role && decodedToken.rol !== role) {
    return <Navigate to="/home" />;
  }

  return <Component />;
};

export default ProtectedRoute;
