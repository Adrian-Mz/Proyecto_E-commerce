import { CategoriaData } from '../data/categorias.data.js';

export const CategoriaService = {
  // Obtener todas las categorías
  async getAllCategorias() {
    try {
      const categorias = await CategoriaData.getAllCategorias();
      return categorias.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      }));
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  },

  // Obtener una categoría por ID
  async getCategoriaById(id) {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new Error('El ID debe ser un número válido');
      }
      const categoria = await CategoriaData.getCategoriaById(id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      return categoria;
    } catch (error) {
      throw new Error(`Error al obtener la categoría: ${error.message}`);
    }
  },

  // Crear una nueva categoría
  async createCategoria(data) {
    try {
      if (!data.nombre || !data.descripcion) {
        throw new Error('Nombre y descripción son obligatorios');
      }
      return await CategoriaData.createCategoria(data);
    } catch (error) {
      throw new Error(`Error al crear la categoría: ${error.message}`);
    }
  },

  // Actualizar una categoría existente
  async updateCategoria(id, data) {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Los datos para actualizar no pueden estar vacíos');
      }
      return await CategoriaData.updateCategoria(id, data);
    } catch (error) {
      throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }
  },

  // Eliminar una categoría
  async deleteCategoria(id) {
    try {
      await CategoriaData.deleteCategoria(id);
      return { message: 'Categoría eliminada exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
  },
};
