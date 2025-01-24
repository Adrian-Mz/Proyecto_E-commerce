import { OpenAIService } from '../utils/openai.js';
import { MercadoLibreAnalisisService } from '../utils/mercadolibreAnalisis.js';

export const AnalisisService = {
  async obtenerPredicciones() {
    try {
      // Datos locales o simulados
      const datosLocales = [
        { producto: 'Laptop Gaming', ventas: 120, categoría: 'Electrónica' },
        { producto: 'Audífonos Bluetooth', ventas: 85, categoría: 'Accesorios' },
        { producto: 'Teclado Mecánico', ventas: 60, categoría: 'Electrónica' },
      ];

      // Datos externos de Mercado Libre
      const productosMercadoLibre = await MercadoLibreAnalisisService.buscarProductos('tecnología');
      console.log('Productos de Mercado Libre:', productosMercadoLibre);

      // Combinando ambos conjuntos de datos
      const datos = [...datosLocales, ...productosMercadoLibre];

      // Generar recomendaciones con OpenAI
      const predicciones = await OpenAIService.generarRecomendaciones(datos);

      return { datos, predicciones };
    } catch (error) {
      console.error('Error en el servicio de análisis:', error.message);
      throw new Error('No se pudieron obtener predicciones.');
    }
  },
};
