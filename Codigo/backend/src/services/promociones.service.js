import { promocionesData } from '../data/promociones.data.js';
import { ProductosData } from '../data/productos.data.js';

export const promocionesService = {
  // Obtener todas las promociones
  async obtenerPromociones() {
    return await promocionesData.getAllPromociones();
  },

  // Crear una nueva promoción
  async crearPromocion(datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin, categoriaId } = datosPromocion;
  
    // Validaciones adicionales (opcional)
    if (!nombre || !descripcion || !descuento) {
      throw new Error('Todos los campos obligatorios deben ser completados.');
    }
    if (descuento <= 0 || descuento > 100) {
      throw new Error('El descuento debe estar entre 1% y 100%.');
    }
    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
    }
  
    // Convertir fechas al formato ISO-8601 si están definidas
    const fechaInicioISO = fechaInicio ? new Date(fechaInicio).toISOString() : null;
    const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : null;
  
    return await promocionesData.createPromocion({
      nombre,
      descripcion,
      descuento,
      fechaInicio: fechaInicioISO,
      fechaFin: fechaFinISO,
      categoriaId,
    });
  },
  

  // Actualizar una promoción existente
  async actualizarPromocion(promocionId, datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin } = datosPromocion;

    // Validaciones adicionales (opcional)
    if (descuento && (descuento <= 0 || descuento > 100)) {
      throw new Error('El descuento debe estar entre 1% y 100%.');
    }
    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.');
    }

    return await promocionesData.updatePromocion(promocionId, {
      nombre,
      descripcion,
      descuento,
      fechaInicio,
      fechaFin,
    });
  },
  
  // Asignar promoción a todos los productos de una categoría
  async asignarPromocionPorCategoria(categoriaId, promocionId) {
    if (!categoriaId || !promocionId) {
      throw new Error("Debe proporcionar una categoría y una promoción.");
    }

    // Validar si la categoría existe
    const categoria = await promocionesData.getCategoriaById(categoriaId);
    if (!categoria) {
      throw new Error(`La categoría con ID ${categoriaId} no existe.`);
    }

    // Validar si la promoción existe
    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) {
      throw new Error(`La promoción con ID ${promocionId} no existe.`);
    }

    // Obtener productos de la categoría
    const productos = await promocionesData.getProductosByCategoria(categoriaId);

    if (productos.length === 0) {
      throw new Error(`No hay productos en la categoría con ID ${categoriaId}.`);
    }

    // Asignar la promoción a cada producto
    const actualizaciones = productos.map((producto) =>
      ProductosData.updateProducto(producto.id, { promocionId })
    );

    await Promise.all(actualizaciones);

    return {
      mensaje: "Promoción asignada correctamente a los productos de la categoría.",
      productosActualizados: productos.length,
    };
  },

  // Eliminar una promoción
  async eliminarPromocion(promocionId) {
    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) {
      throw new Error(`No se encontró la promoción con ID ${promocionId}`);
    }

    return await promocionesData.deletePromocion(promocionId);
  },

  // Obtener una promoción específica por ID
  async obtenerPromocionPorId(promocionId) {
    const promocion = await promocionesData.getPromocionById(promocionId);
    if (!promocion) {
      throw new Error(`No se encontró la promoción con ID ${promocionId}`);
    }

    return promocion;
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
