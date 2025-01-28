import axios from 'axios';
import fs from 'fs'; // Importar fs para leer el archivo adjunto
import path from 'path'; // Importar path para manejar rutas de archivos

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export const enviarCorreo = async (destinatario, asunto, contenido, archivoAdjunto = null) => {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(destinatario)) {
    throw new Error(`El correo electrónico "${destinatario}" no es válido.`);
  }

  const sendSmtpEmail = {
    sender: { name: 'TrendShop', email: 'ksaeteros2001@gmail.com' },
    to: [{ email: destinatario }],
    subject: asunto,
    htmlContent: contenido,
    attachment: archivoAdjunto
      ? [
          {
            name: path.basename(archivoAdjunto),
            content: fs.readFileSync(archivoAdjunto).toString('base64'),
            type: 'application/pdf',
          },
        ]
      : undefined,
  };

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      sendSmtpEmail,
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Correo enviado:', response.data);
    return 'Correo enviado exitosamente.';
  } catch (error) {
    console.error('Error al enviar el correo:', error.response?.data || error.message);
    throw new Error('No se pudo enviar el correo.');
  }
};

