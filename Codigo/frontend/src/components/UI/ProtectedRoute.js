import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, Component }) => {
  const storedUser = localStorage.getItem("usuario");
  
  // Verificar si hay un usuario autenticado
  if (!storedUser) {
    return <Navigate to="/login" />;
  }

  const usuario = JSON.parse(storedUser);
  const decodedToken = jwtDecode(usuario.token);

  // Verificar si el token ha expirado
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("usuario");
    return <Navigate to="/login" />;
  }

  // Verificar si el usuario tiene un rol permitido
  if (allowedRoles && !allowedRoles.includes(decodedToken.rol)) {
    return <Navigate to="/404" />;
  }

  // Renderizar el componente si todas las verificaciones pasan
  return <Component />;
};

export default ProtectedRoute;
