import Brevo from '@getbrevo/brevo';

if (!process.env.BREVO_API_KEY) {
  throw new Error('La clave de API de Brevo no está definida. Verifica tu archivo .env o tu entorno.');
}

// Crear una instancia de TransactionalEmailsApi
const transactionalEmailsApi = new Brevo.TransactionalEmailsApi();

// Configurar la autenticación de la API
transactionalEmailsApi.authentications = transactionalEmailsApi.authentications || {};
transactionalEmailsApi.authentications['apiKey'] = {
  apiKey: process.env.BREVO_API_KEY,
};

export default transactionalEmailsApi;
