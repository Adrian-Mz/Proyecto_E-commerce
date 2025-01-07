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
  
      if (productos.total === 0) {
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
      if (typeof id !== 'number' || isNaN(id)) {
        throw new Error('El ID debe ser un número válido');
      }
      const producto = await ProductosData.getProductoById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto; // Devuelve el producto encontrado
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  },

  // Crear un nuevo producto
  async createProducto(data) {
    try {
      // Validar todos los campos obligatorios
      if (
        !data ||
        !data.nombre ||
        !data.descripcion ||
        typeof data.precio !== 'number' ||
        typeof data.stock !== 'number' ||
        !data.categoriaId ||
        !data.promocionId ||
        !data.especificaciones ||
        !data.marca ||
        !data.garantia
      ) {
        throw new Error(
          'Datos incompletos o inválidos para crear el producto'
        );
      }

      const producto = await ProductosData.createProducto(data);
      return producto; // Devuelve el producto creado
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  },

  // Actualizar un producto por ID
  async updateProducto(id, data) {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new Error('El ID debe ser un número válido');
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Los datos para actualizar el producto no pueden estar vacíos');
      }

      // Validar todos los campos obligatorios
      if (
        !data.promocionId ||
        !data.especificaciones ||
        !data.marca ||
        !data.garantia
      ) {
        throw new Error('Datos incompletos o inválidos para actualizar el producto');
      }

      const producto = await ProductosData.updateProducto(id, data);
      return producto; // Devuelve el producto actualizado
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  },

  // Eliminar un producto por ID
  async deleteProducto(id) {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new Error('El ID debe ser un número válido');
      }
      await ProductosData.deleteProducto(id);
      return { message: 'Producto eliminado exitosamente' }; // Mensaje de confirmación
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  },
};
