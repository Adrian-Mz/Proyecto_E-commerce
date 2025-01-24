import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Asegúrate de tener esta variable en tu .env
});

export const OpenAIService = {
  async generarRecomendaciones(datosProductos) {
    try {
      const prompt = `
        Eres un analista de datos para un e-commerce. Aquí tienes los datos de productos con sus tendencias:
        ${JSON.stringify(datosProductos, null, 2)}

        Analiza estos datos y proporciona:
        1. Tres productos que podrían volverse más populares próximamente.
        2. Categorías que deberían promocionarse para incrementar ventas.
        3. Sugerencias de estrategia de marketing basadas en estos datos.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error al generar recomendaciones con OpenAI:', error.message);
      throw new Error('No se pudieron generar recomendaciones con IA.');
    }
  },
};