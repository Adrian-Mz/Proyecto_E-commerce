export const verifyRole = (requiredRole) => {
    return (req, res, next) => {
      const { user } = req; // Suponiendo que el usuario ya está autenticado
      if (!user || user.rol !== requiredRole) {
        return res.status(403).json({ error: "No tienes permisos para acceder a este recurso" });
      }
      next();
    };
  };
  