import { promocionesData } from '../data/promociones.data.js';

export const promocionesService = {
  // Obtener una promoción por ID
  async obtenerPromocionPorId(promocionId) {
    const promocion = await promocionesData.getPromocionById(promocionId);
  
    if (!promocion) {
      throw new Error(`No se encontró la promoción con ID ${promocionId}.`);
    }
  
    const categorias = promocion.categorias.map((relacion) => ({
      id: relacion.categoria.id,
      nombre: relacion.categoria.nombre,
      descripcion: relacion.categoria.descripcion,
      productos: relacion.categoria.productos, // Agregar productos a la respuesta
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
    const ahora = new Date();
    
    return promociones
      .filter((promocion) =>
        (!promocion.fechaInicio || new Date(promocion.fechaInicio) <= ahora) &&
        (!promocion.fechaFin || new Date(promocion.fechaFin) >= ahora)
      )
      .map((promocion) => ({
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
          productos: relacion.categoria.productos, // Agregar productos a la respuesta
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
  
    if (categorias && categorias.length > 0) {
      const categoriasConConflictos = await promocionesData.getCategoriasConPromocionActiva(categorias, promocionId);
  
      if (categoriasConConflictos.length > 0) {
        throw new Error(
          `No se puede actualizar la promoción. Las siguientes categorías ya tienen promociones activas: ${categoriasConConflictos
            .map((c) => `Categoría ID: ${c.categoriaId}`)
            .join(', ')}`
        );
      }
    }
  
    const fechaInicioISO = fechaInicio ? new Date(fechaInicio).toISOString() : null;
    const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : null;
  
    // Actualizar categorías y sincronizar productos asociados
    await promocionesData.actualizarCategoriasYProductos(promocionId, categorias);
  
    // Actualizar datos principales de la promoción
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

    // Eliminar promoción y sincronizar productos afectados
    return await promocionesData.deletePromocion(promocionId);
  },

  // Obtener promociones por categoría
  async obtenerPromocionesPorCategoria(categoriaId) {
    if (!categoriaId) {
      throw new Error('El ID de la categoría es obligatorio.');
    }
    return await promocionesData.getPromocionesByCategoria(categoriaId);
  },

  async asignarPromocionPorCategoria(categoriaId, promocionId) {
    if (!categoriaId || !promocionId) {
      throw new Error("Se requiere categoría y promoción.");
    }
  
    // Verificar si la promoción existe
    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) {
      throw new Error(`La promoción con ID ${promocionId} no existe.`);
    }
  
    // Verificar si la categoría existe
    const categoria = await promocionesData.getCategoriaById(categoriaId);
    if (!categoria) {
      throw new Error(`La categoría con ID ${categoriaId} no existe.`);
    }
  
    // Asignar la promoción a la categoría y actualizar productos
    await promocionesData.agregarCategoriasAPromocion(promocionId, [categoriaId]);
  
    return { mensaje: `Promoción ${promocionId} asignada a la categoría ${categoriaId}` };
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
