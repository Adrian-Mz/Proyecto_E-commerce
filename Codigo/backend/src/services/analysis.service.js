// services/analysis.service.js
import deepSeekClient from '../utils/deepseek.js';
import { buscarPorTextoCategoria } from '../utils/mercadolibreia.js';

export const AnalysisService = {
    async generarRecomendaciones(datosLocales, textoCategoria, siteId) {
      try {
        // Obtener productos relacionados de Mercado Libre
        const productosExternos = await buscarPorTextoCategoria(textoCategoria, siteId);
  
        // Limitar la cantidad de productos (máximo 5 productos externos)
        const productosFiltrados = productosExternos.slice(0, 5).map(producto => ({
          titulo: producto.title,
          precio: producto.price,
          categoria: producto.category_id,
        }));
  
        // Limitar los datos locales (máximo 5 productos locales)
        const datosLocalesFiltrados = datosLocales.slice(0, 5).map(producto => ({
          nombre: producto.nombre,
          precio: producto.precio,
          categoria: producto.categoria,
        }));
  
        // Crear el prompt para la IA
        const prompt = `
          Eres un analista de datos para un e-commerce. Aquí tienes los datos locales de productos y datos externos de Mercado Libre:
          - Datos locales (máximo 5 productos): ${JSON.stringify(datosLocalesFiltrados, null, 2)}
          - Datos externos de Mercado Libre (máximo 5 productos): ${JSON.stringify(productosFiltrados, null, 2)}
  
          Analiza estos datos y proporciona:
          1. Tres productos que podrían volverse más populares próximamente.
          2. Categorías que deberían promocionarse para incrementar ventas.
          3. Estrategias de marketing basadas en estos datos.
        `;
  
        // Validar el tamaño del prompt
        if (prompt.length > 65000) {
          throw new Error('El prompt excede el límite de tokens permitido. Reduce los datos enviados.');
        }
  
        // Llamada al modelo de IA
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
  
