import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirige si no hay token
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (requiredRole && decoded.rol !== requiredRole) {
        // Redirige según el rol
        navigate(decoded.rol === "Administrador" ? "/admin" : "/home");
      }
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, requiredRole]);

  return children; // Renderiza el contenido protegido
};

export default ProtectedRoute;
