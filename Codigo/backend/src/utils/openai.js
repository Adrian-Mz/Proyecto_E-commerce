const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Usa la variable de entorno para tu clave API
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
