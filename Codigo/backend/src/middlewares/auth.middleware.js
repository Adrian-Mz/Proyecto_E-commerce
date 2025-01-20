import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Captura el token del encabezado Authorization
  if (!token) {
    console.log('Token no proporcionado');
    return res.status(401).json({ error: 'No se proporcionó un token.' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjunta los datos del usuario al request, asegurándote de que el ID sea un número
    req.usuario = {
      ...decoded,
      id: parseInt(decoded.id, 10),
    };

    // Opcional: Renueva el token si está cerca de expirar
    const tiempoRestante = decoded.exp * 1000 - Date.now(); // Tiempo restante en milisegundos
    if (tiempoRestante < 15 * 60 * 1000) { // Si quedan menos de 15 minutos para que expire
      const nuevoToken = jwt.sign(
        {
          id: req.usuario.id, // Ya convertido a número
          nombre: req.usuario.nombre,
          rol: req.usuario.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Renueva el token por 1 hora más
      );

      // Agrega el nuevo token a los encabezados de la respuesta
      res.setHeader('x-renewed-token', nuevoToken); // Header personalizado para enviar el nuevo token
    }

    next();
  } catch (error) {
    console.log('Error al verificar el token:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};
