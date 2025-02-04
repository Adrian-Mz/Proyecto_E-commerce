import { promocionesData } from '../data/promociones.data.js';
import { auditoriaService } from '../services/auditoria.service.js';

export const promocionesService = {
  // Obtener una promoción por ID
  async obtenerPromocionPorId(promocionId) {
    if (isNaN(promocionId)) {
      throw new Error("El ID de la promoción debe ser un número válido.");
    }

    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) {
      throw new Error(`No se encontró la promoción con ID ${promocionId}.`);
    }

    return {
      ...promocion,
      estadoPromocion: this.esPromocionActiva(promocion.fechaInicio, promocion.fechaFin) ? "Activa" : "Inactiva",
      categorias: promocion.categorias.map((relacion) => ({
        id: relacion.categoria.id,
        nombre: relacion.categoria.nombre,
        descripcion: relacion.categoria.descripcion,
        productos: relacion.categoria.productos,
      })),
    };
  },

  // Obtener todas las promociones activas
  async obtenerPromociones() {
    const promociones = await promocionesData.getAllPromociones();

    return promociones.map((promocion) => ({
      id: promocion.id,
      nombre: promocion.nombre,
      descripcion: promocion.descripcion,
      descuento: promocion.descuento,
      fechaInicio: promocion.fechaInicio,
      fechaFin: promocion.fechaFin,
      estadoPromocion: this.esPromocionActiva(promocion.fechaInicio, promocion.fechaFin) ? "Activa" : "Inactiva",
      categorias: promocion.categorias.map((relacion) => ({
        id: relacion.categoria.id,
        nombre: relacion.categoria.nombre,
        descripcion: relacion.categoria.descripcion,
        productos: relacion.categoria.productos,
      })),
    }));
  },

  // Crear una nueva promoción con auditoría
  async crearPromocion(datosPromocion, usuarioId) {
    if (!usuarioId) throw new Error("Usuario no autenticado.");
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categorias } = datosPromocion;

    if (!nombre || !descripcion || !descuento) {
      throw new Error("Todos los campos obligatorios deben ser completados.");
    }

    const categoriasValidas = Array.isArray(categorias) ? categorias : [];
    if (categoriasValidas.length > 0) {
      const categoriasConConflictos = await promocionesData.getCategoriasConPromocionActiva(categoriasValidas);
      if (categoriasConConflictos.length > 0) {
        throw new Error(`No se puede crear la promoción. Las siguientes categorías ya tienen promociones activas: ${categoriasConConflictos.map((c) => `ID: ${c.categoriaId}`).join(", ")}`);
      }
    }

    const nuevaPromocion = await promocionesData.createPromocion({
      nombre,
      descripcion,
      descuento,
      fechaInicio: fechaInicio ? new Date(fechaInicio).toISOString() : null,
      fechaFin: fechaFin ? new Date(fechaFin).toISOString() : null,
      categorias: categoriasValidas,
    });

    await auditoriaService.registrarEvento(usuarioId, "promociones", "CREAR", nuevaPromocion);

    return nuevaPromocion;
  },

  // Actualizar una promoción con auditoría
  async actualizarPromocion(promocionId, datosPromocion, usuarioId) {
    if (!usuarioId) throw new Error("Usuario no autenticado.");
    if (isNaN(promocionId)) throw new Error("El ID de la promoción debe ser un número válido.");

    const promocionActual = await promocionesData.getPromocionById(promocionId);
    if (!promocionActual) throw new Error(`La promoción con ID ${promocionId} no existe.`);

    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categorias } = datosPromocion;

    if (categorias && categorias.length > 0) {
      const categoriasConConflictos = await promocionesData.getCategoriasConPromocionActiva(categorias, promocionId);
      if (categoriasConConflictos.length > 0) {
        throw new Error(`No se puede actualizar la promoción. Las siguientes categorías ya tienen promociones activas: ${categoriasConConflictos.map((c) => `ID: ${c.categoriaId}`).join(", ")}`);
      }
    }

    await promocionesData.actualizarCategoriasYProductos(promocionId, categorias);

    const promocionActualizada = await promocionesData.updatePromocion(promocionId, {
      nombre: nombre || promocionActual.nombre,
      descripcion: descripcion || promocionActual.descripcion,
      descuento: descuento || promocionActual.descuento,
      fechaInicio: fechaInicio ? new Date(fechaInicio).toISOString() : promocionActual.fechaInicio,
      fechaFin: fechaFin ? new Date(fechaFin).toISOString() : promocionActual.fechaFin,
    });

    await auditoriaService.registrarEvento(usuarioId, "promociones", "ACTUALIZAR", promocionActualizada, `Antes: ${JSON.stringify(promocionActual)}`);

    return promocionActualizada;
  },

  // Eliminar una promoción con auditoría
  async eliminarPromocion(promocionId, usuarioId) {
    if (!usuarioId) throw new Error("Usuario no autenticado.");
    if (isNaN(promocionId)) throw new Error("El ID de la promoción debe ser un número válido.");

    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) throw new Error(`No se encontró la promoción con ID ${promocionId}`);

    await promocionesData.deletePromocion(promocionId);

    await auditoriaService.registrarEvento(usuarioId, "promociones", "ELIMINAR", promocion);

    return { mensaje: "Promoción eliminada exitosamente" };
  },

  // Asignar promoción a categoría con auditoría
  async asignarPromocionPorCategoria(categoriaId, promocionId, usuarioId) {
    if (!usuarioId) throw new Error("Usuario no autenticado.");
    if (!categoriaId || !promocionId || isNaN(categoriaId) || isNaN(promocionId)) {
      throw new Error("Debe proporcionar una categoría y promoción válidas.");
    }

    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) throw new Error(`La promoción con ID ${promocionId} no existe.`);

    const categoria = await promocionesData.getCategoriaById(categoriaId);
    if (!categoria) throw new Error(`La categoría con ID ${categoriaId} no existe.`);

    await promocionesData.agregarCategoriasAPromocion(promocionId, [categoriaId]);

    await auditoriaService.registrarEvento(usuarioId, "promociones", "ASIGNAR", { promocionId, categoriaId });

    return { mensaje: `Promoción ${promocionId} asignada a la categoría ${categoriaId}` };
  },

  // Verificar si la promoción está activa
  esPromocionActiva(fechaInicio, fechaFin) {
    const ahora = new Date();
    return (!fechaInicio || new Date(fechaInicio) <= ahora) && (!fechaFin || new Date(fechaFin) >= ahora);
  },
};
