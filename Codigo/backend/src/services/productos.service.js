import { ProductosData } from '../data/productos.data.js';

export const ProductosService = {
  // Obtener todos los productos
  async getAllProductos(params) {
    try {
      const { search, categoriaId, page, pageSize } = params;
      const productos = await ProductosData.getAllProductos({
        search,
        categoriaId,
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
      });
  
      if (!productos || productos.length === 0) {
        return { productos: [], message: "No se encontraron productos con esa categoría." };
      }
  
      return productos;
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  },
  

  // Obtener un producto por ID
  async getProductoById(id) {
    try {
      validarId(id);
      const producto = await ProductosData.getProductoById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  },

  // Crear un nuevo producto
  async createProducto(data) {
    try {
      if (
        !data ||
        !data.nombre ||
        !data.descripcion ||
        typeof data.precio !== 'number' ||
        typeof data.stock !== 'number' ||
        !data.categoriaId
      ) {
        throw new Error('Datos incompletos o inválidos para crear el producto');
      }

      const producto = await ProductosData.createProducto(data);
      return producto;
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  },

  // Actualizar un producto por ID
  async updateProducto(id, data) {
    try {
      validarId(id);
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Los datos para actualizar el producto no pueden estar vacíos');
      }

      const producto = await ProductosData.updateProducto(id, data);
      return producto;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  },

  // Eliminar un producto por ID
  async deleteProducto(id) {
    try {
      validarId(id);
      await ProductosData.deleteProducto(id);
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  },
};

function validarId(id) {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new Error('El ID debe ser un número válido');
  }
}
