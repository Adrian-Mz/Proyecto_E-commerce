import { promocionesData } from '../data/promociones.data.js';

export const promocionesService = {
  // Obtener todas las promociones
  async obtenerPromociones() {
    return await promocionesData.getAllPromociones();
  },

  // Crear una nueva promoción
  async crearPromocion(datosPromocion) {
    const { nombre, descripcion, descuento, fechaInicio, fechaFin } = datosPromocion;
  
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
};
