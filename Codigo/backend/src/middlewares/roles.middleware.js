export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const { user } = req; // Requiere que el usuario esté autenticado
    if (!user || !rolesPermitidos.includes(user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso.' });
    }
    next();
  };
};
