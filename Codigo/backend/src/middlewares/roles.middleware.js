export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const { usuario } = req; // Requiere que el usuario esté autenticado
    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso.' });
    }
    next();
  };
};
