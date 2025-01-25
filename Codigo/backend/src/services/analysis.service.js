// services/analysis.service.js
import deepSeekClient from '../utils/deepseek.js';
import { buscarPorTextoCategoria } from '../utils/mercadolibreia.js';

export const AnalysisService = {
    async generarRecomendaciones(datosLocales, textoCategoria, siteId) {
      try {
        // Obtener productos relacionados de Mercado Libre
        const productosExternos = await buscarPorTextoCategoria(textoCategoria, siteId);
  
        // Limitar la cantidad de productos (por ejemplo, a los primeros 10)
        const productosFiltrados = productosExternos.slice(0, 10);
        const datosLocalesFiltrados = datosLocales.slice(0, 10);
  
        const prompt = `
          Eres un analista de datos para un e-commerce. Aquí tienes los datos locales de productos y datos externos de Mercado Libre:
          - Datos locales: ${JSON.stringify(datosLocalesFiltrados, null, 2)}
          - Datos externos (Mercado Libre): ${JSON.stringify(productosFiltrados, null, 2)}
  
          Analiza estos datos y proporciona:
          1. Tres productos que podrían volverse más populares próximamente.
          2. Categorías que deberían promocionarse para incrementar ventas.
          3. Estrategias de marketing basadas en estos datos.
        `;
  
        const response = await deepSeekClient.chat.completions.create({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });
  
        return response.choices[0].message.content;
      } catch (error) {
        console.error('Error al generar recomendaciones:', error.message);
        throw new Error('No se pudieron generar recomendaciones con IA.');
      }
    },
  };
