import { devolucionesData } from "../data/devoluciones.data.js";
import { pedidosData } from "../data/pedidos.data.js";
import { enviarCorreo } from '../utils/emailService.js';

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
        const devolucion = await devolucionesData.createDevolucion({
            pedidoId,
            motivo,
            estadoId: 5, // Estado inicial: "Pendiente"
            fechaDevolucion: new Date(),
        });

        // Actualizar el estado del pedido a "En proceso de devolución pendiente"
        await pedidosData.actualizarEstadoPedido(pedidoId, 5); // Estado 5: "En proceso de devolución pendiente"

        return {
            mensaje: 'Devolución registrada correctamente.',
            devolucion,
        };
    },

    async actualizarEstadoDevolucion(devolucionId, nuevoEstadoId, correoUsuario) {
        const devolucion = await devolucionesData.getDevolucionById(devolucionId);
        if (!devolucion) {
        throw new Error(`No se encontró una devolución con ID ${devolucionId}.`);
        }

        const estadosValidos = {
        5: [6, 7], // Pendiente → Aceptada o Rechazada
        6: [8], // Aceptada → Completada
        7: [], // Rechazada (final)
        };

        if (!estadosValidos[devolucion.estadoId]?.includes(nuevoEstadoId)) {
        throw new Error("La transición de estado no es válida.");
        }

        const devolucionActualizada = await devolucionesData.updateDevolucion(devolucionId, {
        estadoId: nuevoEstadoId,
        fechaResolucion: new Date(),
        });

        // Manejar notificaciones por correo
        await this.enviarCorreoEstadoDevolucion(correoUsuario, nuevoEstadoId, devolucionActualizada);

        // Si la devolución se completa o rechaza, limpiar el pedido
        if (nuevoEstadoId === 7 || nuevoEstadoId === 8) {
        await pedidosData.actualizarEstado(devolucion.pedidoId, 4); // Volver a "Entregado"
        }

        return {
        mensaje: "Estado de devolución actualizado correctamente.",
        devolucion: devolucionActualizada,
        };
    },

    async enviarCorreoEstadoDevolucion(correoUsuario, estadoId, devolucion) {
        let asunto = "";
        let contenido = "";

        switch (estadoId) {
        case 6: // Aceptada
            asunto = "Devolución Aceptada: Instrucciones a seguir";
            contenido = `
            <p>Hola,</p>
            <p>Tu solicitud de devolución para el pedido <strong>${devolucion.pedidoId}</strong> ha sido aceptada.</p>
            <p>Por favor, responde a este correo adjuntando las siguientes evidencias:</p>
            <ul>
                <li>Fotos del producto empaquetado para su devolución.</li>
                <li>Opcional: Fotos del recibo de envío, si aplica.</li>
            </ul>
            <p>Una vez recibamos tu evidencia, procesaremos la devolución.</p>
            <p>Gracias por tu colaboración.</p>
            `;
            break;
        case 7: // Rechazada
            asunto = "Devolución Rechazada";
            contenido = `
            <p>Hola,</p>
            <p>Lamentamos informarte que tu solicitud de devolución para el pedido <strong>${devolucion.pedidoId}</strong> ha sido rechazada.</p>
            <p>Si tienes preguntas, contáctanos.</p>
            `;
            break;
        case 8: // Completada
            asunto = "Devolución Completada";
            contenido = `
            <p>Hola,</p>
            <p>Tu devolución para el pedido <strong>${devolucion.pedidoId}</strong> se ha completado con éxito.</p>
            <p>Gracias por confiar en TrendShop.</p>
            `;
            break;
        default:
            throw new Error("Estado de devolución no reconocido para el correo.");
        }

        await enviarCorreo(correoUsuario, asunto, contenido);
    },
};
