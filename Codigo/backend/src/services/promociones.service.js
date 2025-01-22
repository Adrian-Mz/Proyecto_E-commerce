import { promocionesData } from '../data/promociones.data.js';
import { ProductosData } from '../data/productos.data.js';

export const promocionesService = {
  // Obtener una promoción por ID
  async obtenerPromocionPorId(promocionId) {
    const promocion = await promocionesData.getPromocionById(promocionId);

    if (!promocion) {
      throw new Error(`No se encontró la promoción con ID ${promocionId}.`);
    }

    // Formatear las categorías asociadas para que sean claras
    const categorias = promocion.categorias.map((relacion) => ({
      id: relacion.categoria.id,
      nombre: relacion.categoria.nombre,
      descripcion: relacion.categoria.descripcion,
    }));

    return {
      id: promocion.id,
      nombre: promocion.nombre,
      descripcion: promocion.descripcion,
      descuento: promocion.descuento,
      fechaInicio: promocion.fechaInicio,
      fechaFin: promocion.fechaFin,
      categorias,
    };
  },

  // Obtener todas las promociones
  async obtenerPromociones() {
    const promociones = await promocionesData.getAllPromociones();
    return promociones.map((promocion) => ({
      id: promocion.id,
      nombre: promocion.nombre,
      descripcion: promocion.descripcion,
      descuento: promocion.descuento,
      fechaInicio: promocion.fechaInicio,
      fechaFin: promocion.fechaFin,
      categorias: promocion.categorias.map((relacion) => ({
        id: relacion.categoria.id,
        nombre: relacion.categoria.nombre,
        descripcion: relacion.categoria.descripcion,
      })),
    }));
  },

  // Crear una nueva promoción
  async crearPromocion(datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categorias } = datosPromocion;
  
    if (!nombre || !descripcion || !descuento) {
      throw new Error('Todos los campos obligatorios deben ser completados.');
    }
  
    // Asegúrate de que categorias sea un arreglo o establece un valor vacío
    const categoriasValidas = Array.isArray(categorias) ? categorias : [];
  
    if (categoriasValidas.length > 0) {
      const categoriasConConflictos = await promocionesData.getCategoriasConPromocionActiva(categoriasValidas);
  
      if (categoriasConConflictos.length > 0) {
        throw new Error(
          `No se puede crear la promoción. Las siguientes categorías ya tienen promociones activas: ${categoriasConConflictos
            .map((c) => `Categoría ID: ${c.categoriaId} (Promoción ID: ${c.promocionId})`)
            .join(', ')}`
        );
      }
    }
  
    const fechaInicioISO = fechaInicio ? new Date(fechaInicio).toISOString() : null;
    const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : null;
  
    return await promocionesData.createPromocion({
      nombre,
      descripcion,
      descuento,
      fechaInicio: fechaInicioISO,
      fechaFin: fechaFinISO,
      categorias: categoriasValidas,
    });
  },  

  // Actualizar una promoción existente
  async actualizarPromocion(promocionId, datosPromocion) {
    const promocionActual = await promocionesData.getPromocionById(promocionId);
    if (!promocionActual) {
      throw new Error(`La promoción con ID ${promocionId} no existe.`);
    }

    const {
      nombre = promocionActual.nombre,
      descripcion = promocionActual.descripcion,
      descuento = promocionActual.descuento,
      fechaInicio = promocionActual.fechaInicio,
      fechaFin = promocionActual.fechaFin,
      categorias = [],
    } = datosPromocion;

    // Validar las categorías solo si se envían
    if (categorias && categorias.length > 0) {
      // Obtener categorías que ya tienen relaciones activas con otras promociones
      const categoriasConConflictos = await promocionesData.getCategoriasConPromocionActiva(categorias, promocionId);

      if (categoriasConConflictos.length > 0) {
        throw new Error(
          `No se puede actualizar la promoción. Las siguientes categorías ya tienen promociones activas: ${categoriasConConflictos
            .map((c) => `Categoría ID: ${c.categoriaId}`)
            .join(', ')}`
        );
      }

      // Categorías actuales asociadas con la promoción
      const categoriasActuales = promocionActual.categorias.map((relacion) => relacion.categoriaId);

      // Identificar categorías a eliminar (que están actualmente pero no en la nueva lista)
      const categoriasAEliminar = categoriasActuales.filter(
        (categoriaId) => !categorias.includes(categoriaId)
      );

      // Identificar categorías a agregar (que no están actualmente asociadas)
      const categoriasAAgregar = categorias.filter(
        (categoriaId) => !categoriasActuales.includes(categoriaId)
      );

      // Eliminar categorías que ya no están asociadas
      if (categoriasAEliminar.length > 0) {
        await promocionesData.eliminarCategoriasDePromocion(promocionId, categoriasAEliminar);
      }

      // Agregar nuevas categorías a la promoción
      if (categoriasAAgregar.length > 0) {
        await promocionesData.agregarCategoriasAPromocion(promocionId, categoriasAAgregar);
      }
    }

    const fechaInicioISO = fechaInicio ? new Date(fechaInicio).toISOString() : null;
    const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : null;

    // Actualizar las categorías de la promoción
    await promocionesData.actualizarCategoriasPromocion(promocionId, categorias);

    // Actualizar los datos principales de la promoción
    return await promocionesData.updatePromocion(promocionId, {
      nombre,
      descripcion,
      descuento,
      fechaInicio: fechaInicioISO,
      fechaFin: fechaFinISO,
    });
  },
  

  // Eliminar una promoción
  async eliminarPromocion(promocionId) {
    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) {
      throw new Error(`No se encontró la promoción con ID ${promocionId}`);
    }

    return await promocionesData.deletePromocion(promocionId);
  },

  // Obtener promociones por categoría
  async obtenerPromocionesPorCategoria(categoriaId) {
    if (!categoriaId) {
      throw new Error('El ID de la categoría es obligatorio.');
    }
    return await promocionesData.getPromocionesByCategoria(categoriaId);
  },

  // Verificar si la promoción está activa
  esPromocionActiva(fechaInicio, fechaFin) {
    const ahora = new Date();
    return (
      (!fechaInicio || new Date(fechaInicio) <= ahora) &&
      (!fechaFin || new Date(fechaFin) >= ahora)
    );
  },
};
