import axios from 'axios';
import { subirImagenCloudinary } from './cloudinary.js';
import fs from 'fs';
import path from 'path';

const tempDir = path.join('C:', 'tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

export const buscarProductosMercadoLibre = async (query) => {
  try {
    // Realiza la búsqueda inicial
    const response = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}`,
      { timeout: 10000 }
    );

    if (response.data.results && response.data.results.length > 0) {
      let productoSeleccionado = null;
      let mayorSimilitud = 0;

      // Buscar el producto con el título más parecido al query
      for (const producto of response.data.results) {
        const similitud = calcularSimilitud(query.toLowerCase(), producto.title.toLowerCase());
        if (similitud > mayorSimilitud) {
          mayorSimilitud = similitud;
          productoSeleccionado = producto;
        }
        if (similitud === 1) break; // Coincidencia perfecta
      }

      if (productoSeleccionado) {
        // Llama a la API de detalles del producto
        const detailResponse = await axios.get(
          `https://api.mercadolibre.com/items/${productoSeleccionado.id}`
        );

        if (detailResponse.data.pictures && detailResponse.data.pictures.length > 0) {
          // Usa la primera imagen en alta calidad
          const highQualityImageUrl = detailResponse.data.pictures[0].url;

          // Descargar la imagen de alta calidad
          const imageResponse = await axios.get(highQualityImageUrl, {
            responseType: 'arraybuffer',
            timeout: 5000,
          });

          const tempFilePath = path.join(tempDir, `${productoSeleccionado.id}.jpg`);
          fs.writeFileSync(tempFilePath, imageResponse.data);

          // Subir la imagen a Cloudinary
          const cloudinaryUrl = await subirImagenCloudinary(tempFilePath, 'mercadolibre');

          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }

          // Retornar el producto seleccionado con la imagen subida a Cloudinary
          return {
            id: productoSeleccionado.id,
            titulo: productoSeleccionado.title,
            imagen: cloudinaryUrl,
            link: productoSeleccionado.permalink,
          };
        } else {
          throw new Error('No se encontraron imágenes de alta calidad para este producto.');
        }
      }
    }

    return null; // Si no se encuentra un producto similar
  } catch (error) {
    console.error(`Error al buscar productos en Mercado Libre: ${error.message}`);
    throw new Error('Error al comunicarse con la API de Mercado Libre');
  }
};

// Función para calcular similitud básica entre dos strings
const calcularSimilitud = (str1, str2) => {
  const palabras1 = str1.split(' ');
  const palabras2 = str2.split(' ');

  const palabrasComunes = palabras1.filter((palabra) => palabras2.includes(palabra));
  return palabrasComunes.length / Math.max(palabras1.length, palabras2.length);
};
