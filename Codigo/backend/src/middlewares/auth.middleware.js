import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Captura el token del encabezado Authorization
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó un token.' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjunta los datos del usuario al request
    req.user = decoded;

    // Opcional: Renueva el token si está cerca de expirar
    const tiempoRestante = decoded.exp * 1000 - Date.now(); // Tiempo restante en milisegundos
    if (tiempoRestante < 15 * 60 * 1000) { // Si quedan menos de 15 minutos para que expire
      const nuevoToken = jwt.sign(
        {
          id: decoded.id,
          nombre: decoded.nombre,
          rol: decoded.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Renueva el token por 1 hora más
      );

      // Agrega el nuevo token a los encabezados de la respuesta
      res.setHeader('x-renewed-token', nuevoToken); // Header personalizado para enviar el nuevo token
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
