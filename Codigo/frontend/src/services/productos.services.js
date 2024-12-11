import { ProductosAPI } from '../api/api.productos';

export const ProductosService = {
  async getProductos() {
    const productos = await ProductosAPI.getAllProductos();
    return productos.map((producto) => ({
      ...producto
    }));
  },
};
