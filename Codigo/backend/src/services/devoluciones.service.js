import { devolucionesData } from '../data/devoluciones.data.js';
import { pedidosData } from '../data/pedidos.data.js';

export const devolucionesService = {
  
    async obtenerDevolucionPorId(devolucionId) {
        return await devolucionesData.getDevolucionById(devolucionId);
    },
    // Registrar una devolución
    async registrarDevolucion(pedidoId, motivo) {
        // Obtener el pedido para verificar su estado
        const pedido = await pedidosData.getPedidoById(pedidoId);

        if (!pedido) {
            throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
        }

        // Validar que el pedido esté en estado "Entregado"
        if (pedido.estadoId !== 4) { // Estado 4: "Entregado"
            throw new Error(`Solo se pueden solicitar devoluciones para pedidos en estado 'Entregado'.`);
        }

        // Crear el registro de devolución
        const devolucion = await devolucionesData.crearDevolucion({
            pedidoId,
            motivo,
            estadoId: 1, // Estado inicial: "Pendiente"
            fechaDevolucion: new Date(),
        });

        // Actualizar el estado del pedido a "En proceso de devolución pendiente"
        await pedidosData.actualizarEstadoPedido(pedidoId, 5); // Estado 5: "En proceso de devolución pendiente"

        return {
            mensaje: 'Devolución registrada correctamente.',
            devolucion,
        };
    },

    // Actualizar el estado de la devolución
    async actualizarEstadoDevolucion(devolucionId, nuevoEstadoId) {
        const devolucion = await devolucionesData.obtenerDevolucionPorId(devolucionId);

        if (!devolucion) {
            throw new Error(`No se encontró una devolución con ID ${devolucionId}.`);
        }

        const devolucionActualizada = await devolucionesData.actualizarEstadoDevolucion(
            devolucionId,
            nuevoEstadoId
        );

        return {
            mensaje: 'Estado de devolución actualizado correctamente.',
            devolucion: devolucionActualizada,
        };
    },
};
