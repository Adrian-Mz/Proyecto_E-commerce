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
        ivaPorcentaje: categoria.categoria_iva ? categoria.categoria_iva.ivaPorcentaje: "", // 🔹 IVA por defecto si no está definido
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

  // Verificar si una promoción está activa
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
      if (isNaN(id) || typeof id !== 'number') {
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

  // Crear una nueva categoría con auditoría
  async createCategoria(data, usuarioId) {
    try {
      if (!usuarioId) {
        throw new Error("El usuarioId es obligatorio para registrar auditoría.");
      }

      if (!data.nombre || !data.descripcion) {
        throw new Error("Nombre y descripción son obligatorios.");
      }

      const nuevaCategoria = await CategoriaData.createCategoria(data);

      // Registrar auditoría con IVA incluido
      await auditoriaService.registrarEvento(
        usuarioId,
        "categorias",
        "CREAR",
        nuevaCategoria,
        `Nueva categoría creada: ${data.nombre} con IVA ${data.ivaPorcentaje || 'N/A'}%`
      );

      return nuevaCategoria;
    } catch (error) {
      throw new Error(`Error al crear la categoría: ${error.message}`);
    }
  },

  // Actualizar una categoría con auditoría
  async updateCategoria(id, data, usuarioId) {
    try {
      if (isNaN(id) || typeof id !== 'number') {
        throw new Error('El ID debe ser un número válido.');
      }
      if (!usuarioId) {
        throw new Error("El usuarioId es obligatorio para registrar auditoría.");
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Los datos para actualizar no pueden estar vacíos.");
      }

      const categoriaActual = await CategoriaData.getCategoriaById(id);
      if (!categoriaActual) {
        throw new Error("Categoría no encontrada.");
      }

      const dataActualizada = { ...data };
      delete dataActualizada.promocionesActivas; // Evita actualizar campos no válidos

      const cambios = {};
      Object.keys(dataActualizada).forEach((campo) => {
        if (dataActualizada[campo] !== categoriaActual[campo]) {
          cambios[campo] = { antes: categoriaActual[campo], despues: dataActualizada[campo] };
        }
      });

      // 🔹 Comparar el IVA si ha cambiado
      if (
        data.ivaPorcentaje !== undefined &&
        (!categoriaActual.categoria_iva || data.ivaPorcentaje !== categoriaActual.categoria_iva.ivaPorcentaje)
      ) {
        cambios["ivaPorcentaje"] = {
          antes: categoriaActual.categoria_iva ? categoriaActual.categoria_iva.ivaPorcentaje : "N/A",
          despues: data.ivaPorcentaje,
        };
      }

      if (Object.keys(cambios).length === 0) {
        throw new Error("No se realizaron cambios en la categoría.");
      }

      const categoriaActualizada = await CategoriaData.updateCategoria(id, dataActualizada);

      // 🔹 Si el IVA cambió, actualizarlo en todos los productos de la categoría
      if (data.ivaPorcentaje !== undefined) {
        await ProductosData.actualizarIvaEnProductosPorCategoria(id, data.ivaPorcentaje);
      }

      // Sincronizar promociones y productos relacionados
      await promocionesData.sincronizarPromocionesPorCategoria(id);
      await ProductosData.updateProductosByCategoria(id, categoriaActualizada.promocionId);

      // Registrar auditoría incluyendo el cambio de IVA si hubo
      await auditoriaService.registrarEvento(
        usuarioId,
        "categorias",
        "ACTUALIZAR",
        categoriaActualizada,
        JSON.stringify(cambios)
      );

      return categoriaActualizada;
    } catch (error) {
      throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }
  },

  // Eliminar una categoría con auditoría
  async deleteCategoria(id, usuarioId) {
    try {
      if (isNaN(id) || typeof id !== 'number') {
        throw new Error('El ID debe ser un número válido.');
      }
      if (!usuarioId) {
        throw new Error("El usuarioId es obligatorio para registrar auditoría.");
      }
  
      const categoriaEliminada = await CategoriaData.getCategoriaById(id);
      if (!categoriaEliminada) {
        throw new Error("Categoría no encontrada.");
      }
  
      // 🔹 Verificar si la categoría tiene productos antes de intentar eliminar
      const productosAsociados = await CategoriaData.getProductosByCategoria(id);
      if (productosAsociados.length > 0) {
        throw new Error(
          "No puedes eliminar esta categoría porque tiene productos asociados. Elimina o reasigna los productos antes de continuar."
        );
      }
  
      // 🔹 Eliminar el IVA de la categoría antes de eliminarla
      await CategoriaData.eliminarIvaPorCategoria(id);
  
      // 🔹 Eliminar la categoría
      await CategoriaData.deleteCategoria(id);
  
      // Registrar auditoría
      await auditoriaService.registrarEvento(
        usuarioId,
        "categorias",
        "ELIMINAR",
        categoriaEliminada,
        `Categoría eliminada: ${categoriaEliminada.nombre} con IVA ${categoriaEliminada.categoria_iva ? categoriaEliminada.categoria_iva.ivaPorcentaje : 'N/A'}%`
      );
  
      return { message: "Categoría eliminada exitosamente" };
    } catch (error) {
      if (error.message.includes("Foreign key constraint")) {
        throw new Error(
          "No puedes eliminar esta categoría porque tiene productos asociados. Elimina o reasigna los productos antes de continuar."
        );
      }
      throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
  } 
  
};