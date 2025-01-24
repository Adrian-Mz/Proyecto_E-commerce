import axios from 'axios';

export const MercadoLibreAnalisisService = {
  async buscarProductos(query, categoriaId = null) {
    try {
      const baseUrl = 'https://api.mercadolibre.com/sites/MLA/search';
      const params = { q: query };
      
      if (categoriaId) {
        params.category = categoriaId;
      }

      const response = await axios.get(baseUrl, { params });

      // Procesar los datos para simplificar
      const productos = response.data.results.map((producto) => ({
        id: producto.id,
        titulo: producto.title,
        precio: producto.price,
        ventas: producto.sold_quantity,
        categoria: producto.category_id,
        link: producto.permalink,
        imagen: producto.thumbnail,
      }));

      return productos;
    } catch (error) {
      console.error('Error al obtener productos de Mercado Libre:', error.message);
      throw new Error('No se pudieron obtener los productos de Mercado Libre.');
    }
  },
};
