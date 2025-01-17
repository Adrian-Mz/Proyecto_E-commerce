import { ProductosData } from '../data/productos.data.js';
import { subirImagenCloudinary } from '../utils/cloudinary.js';
import { buscarProductosMercadoLibre } from '../utils/mercadoLibre.js';
import {pedidosData} from '../data/pedidos.data.js';
import {carritoData} from '../data/carrito.data.js';
import fs from 'fs';

export const ProductosService = {
  // Obtener todos los productos
  async getAllProductos(params) {
    try {
      const { search, categoriaId, page, pageSize, orderBy, orderDirection } = params;
  
      const validPage = Math.max(parseInt(page, 10) || 1, 1);
      const validPageSize = parseInt(pageSize, 10) || 0;
  
      // Valida el campo para ordenar
      const validOrderBy = ["nombre", "precio", "createdAt"].includes(orderBy) ? orderBy : "nombre";
  
      // Valida la dirección de orden
      const validOrderDirection = ["asc", "desc"].includes(orderDirection?.toLowerCase()) ? orderDirection : "asc";
  
      const { productos, total } = await ProductosData.getAllProductos({
        search,
        categoriaId,
        page: validPage,
        pageSize: validPageSize,
        orderBy: validOrderBy,
        orderDirection: validOrderDirection,
      });
  
      return {
        productos,
        total,
        currentPage: validPage,
        totalPages: validPageSize > 0 ? Math.ceil(total / validPageSize) : 1,
      };
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

      let imageUrl;

      if (data.imagenLocalPath) {
        imageUrl = await subirImagenCloudinary(data.imagenLocalPath, 'productos');
      } else {
        const productoML = await buscarProductosMercadoLibre(data.nombre);
        if (productoML) {
          imageUrl = productoML.imagen;
        } else {
          throw new Error('No se encontró una imagen adecuada para el producto.');
        }
      }

      data.imagen = imageUrl;

      // Crear el producto en la base de datos
      return await ProductosData.createProducto(data);
    } catch (error) {
      console.error(`Error al crear producto: ${error.message}`);
      throw error;
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
      // Validar que el ID sea válido
      validarId(id);

      // Verificar si el producto está relacionado con algún pedido
      const pedidosRelacionados = await pedidosData.getPedidosByProductoId(id);
      if (pedidosRelacionados.length > 0) {
        throw new Error(
          `No se puede eliminar el producto. Está asociado a ${pedidosRelacionados.length} pedido(s).`
        );
      }

      // Verificar si el producto está relacionado con algún carrito
      const carritosRelacionados = await carritoData.getCarritosByProductoId(id);
      if (carritosRelacionados.length > 0) {
        throw new Error(
          `No se puede eliminar el producto. Está agregado en ${carritosRelacionados.length} carrito(s).`
        );
      }

      // Si no hay relaciones, eliminar el producto
      await ProductosData.deleteProducto(id);
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      // Manejar errores y lanzar una excepción
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
};

function validarId(id) {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new Error('El ID debe ser un número válido');
  }
}
