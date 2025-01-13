import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export const enviarCorreo = async (destinatario, asunto, contenido) => {
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!isValidEmail(destinatario)) {
    throw new Error(`El correo electrónico "${destinatario}" no es válido.`);
  }

  const sendSmtpEmail = {
    sender: { name: 'Tu Empresa', email: 'ksaeteros2001@gmail.com' },
    to: [{ email: destinatario }],
    subject: asunto,
    htmlContent: contenido,
  };

  console.log('Datos del correo:', sendSmtpEmail);

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
