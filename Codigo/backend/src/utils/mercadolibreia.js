import axios from 'axios';

export async function buscarPorTextoCategoria(textoCategoria, siteId = 'MLA') {
  try {
    const url = `https://api.mercadolibre.com/sites/${siteId}/search?q=${encodeURIComponent(textoCategoria)}`;
    console.log('Solicitando datos de Mercado Libre con URL:', url);

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Error en la respuesta de Mercado Libre: ${response.status}`);
    }

    return response.data.results;
  } catch (error) {
    console.error('Error al buscar productos por texto de categoría:', error.message);
    throw new Error('No se pudieron obtener productos para la categoría ingresada.');
  }
}
