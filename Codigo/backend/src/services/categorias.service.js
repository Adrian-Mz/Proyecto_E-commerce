import { CategoriaData } from '../data/categorias.data.js';
import { promocionesData } from '../data/promociones.data.js';
import { ProductosData } from '../data/productos.data.js';
import { auditoriaService } from './auditoria.service.js';

export const CategoriaService = {
  // Obtener todas las categorías
  async getAllCategorias() {
    try {
      const categorias = await CategoriaData.getAllCategorias();
      return categorias.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        promocionesActivas: categoria.promociones
          .filter((relacion) =>
            this.esPromocionActiva(relacion.promocion.fechaInicio, relacion.promocion.fechaFin)
          )
          .map((relacion) => ({
            id: relacion.promocion.id,
            nombre: relacion.promocion.nombre,
            descuento: relacion.promocion.descuento,
          })),
      }));
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  },  

   // Función para verificar si una promoción está activa
   esPromocionActiva(fechaInicio, fechaFin) {
    const ahora = new Date();
    return (
      (!fechaInicio || new Date(fechaInicio) <= ahora) &&
      (!fechaFin || new Date(fechaFin) >= ahora)
    );
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
  async createCategoria(data, usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("El usuarioId es obligatorio para registrar auditoría.");
      }
  
      if (!data.nombre || !data.descripcion) {
        throw new Error("Nombre y descripción son obligatorios.");
      }
  
      // Crear la nueva categoría en la BD
      const nuevaCategoria = await CategoriaData.createCategoria(data);
  
      // ✅ Registrar auditoría
      await auditoriaService.registrarEvento(
        usuarioId,
        "categorias",
        "CREAR",
        nuevaCategoria,
        `Nueva categoría creada: ${data.nombre}`
      );
  
      return nuevaCategoria;
    } catch (error) {
      throw new Error(`Error al crear la categoría: ${error.message}`);
    }
  },

  // Actualizar una categoría existente
  async updateCategoria(id, data, usuarioId) {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Los datos para actualizar no pueden estar vacíos.");
      }
  
      const categoriaActual = await CategoriaData.getCategoriaById(id);
      if (!categoriaActual) {
        throw new Error("Categoría no encontrada.");
      }
  
      // Eliminar campos no actualizables directamente en la tabla
      const dataActualizada = { ...data };
      delete dataActualizada.promocionesActivas;
  
      // Filtrar solo los cambios reales
      const cambios = {};
      Object.keys(dataActualizada).forEach((campo) => {
        if (dataActualizada[campo] !== categoriaActual[campo]) {
          cambios[campo] = { antes: categoriaActual[campo], despues: dataActualizada[campo] };
        }
      });
  
      if (Object.keys(cambios).length === 0) {
        throw new Error("No se realizaron cambios en la categoría.");
      }
  
      // Actualizar categoría en la BD
      const categoriaActualizada = await CategoriaData.updateCategoria(id, dataActualizada);
  
      // ✅ Sincronizar promociones de la categoría
      await promocionesData.sincronizarPromocionesPorCategoria(id);
  
      // ✅ Actualizar productos asociados a la categoría
      await ProductosData.updateProductosByCategoria(id, categoriaActualizada.promocionId);
  
      // Registrar cambios en auditoría
      await auditoriaService.registrarEvento(
        usuarioId,
        "categorias",
        "ACTUALIZAR",
        categoriaActualizada,
        JSON.stringify(cambios) // Solo cambios específicos
      );
  
      return categoriaActualizada;
    } catch (error) {
      throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }
  },  


  // Eliminar una categoría con Auditoría
  async deleteCategoria(id, usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("El usuarioId es obligatorio para registrar auditoría.");
      }
  
      const categoriaEliminada = await CategoriaData.getCategoriaById(id);
      if (!categoriaEliminada) {
        throw new Error("Categoría no encontrada.");
      }
  
      // Eliminar la categoría en la base de datos
      await CategoriaData.deleteCategoria(id);
  
      // ✅ Registrar Auditoría SOLO si la eliminación fue exitosa
      await auditoriaService.registrarEvento(
        usuarioId,
        "categorias",
        "ELIMINAR",
        categoriaEliminada,
        `Categoría eliminada: ${categoriaEliminada.nombre}`
      );
  
      return { message: "Categoría eliminada exitosamente" };
    } catch (error) {
      throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
  }
  
};
