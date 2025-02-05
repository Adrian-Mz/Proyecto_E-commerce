import { devolucionesData } from "../data/devoluciones.data.js";
import { pedidosData } from "../data/pedidos.data.js";
import { ProductosData } from "../data/productos.data.js";
import { enviarCorreo } from '../utils/emailService.js';

export const devolucionesService = {

    async obtenerTodasLasDevoluciones() {
        return await devolucionesData.getAllDevoluciones();
    },

    async obtenerDevolucionPorId(devolucionId) {
        return await devolucionesData.getDevolucionById(devolucionId);
    },

    async registrarDevolucion(pedidoId, productosDevueltos, motivoGeneral = null) {
        const pedido = await pedidosData.getPedidoById(pedidoId);
        if (!pedido) {
            throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
        }

        if (pedido.estadoId !== 4) {
            throw new Error(`Solo se pueden solicitar devoluciones para pedidos en estado 'Entregado'.`);
        }

        const devolucionesExistentes = await devolucionesData.getDevolucionesByPedidoId(pedidoId);
        if (devolucionesExistentes.length > 0) {
            throw new Error(`Ya existe una devolución registrada para este pedido.`);
        }

        let tipoDevolucion = "parcial";
        let estadoDevolucion = 9;

        if (!productosDevueltos || productosDevueltos.length === 0) {
            if (!motivoGeneral || motivoGeneral.trim() === "") {
                throw new Error("Debe proporcionar un motivo para la devolución completa del pedido.");
            }
            
            productosDevueltos = pedido.productos.map(p => ({
                productoId: p.productoId,
                cantidad: p.cantidad,
                motivo: motivoGeneral,
            }));

            tipoDevolucion = "completa";
            estadoDevolucion = 5;
        }

        for (const item of productosDevueltos) {
            const productoPedido = pedido.productos.find(p => p.productoId === item.productoId);
            if (!productoPedido) {
                throw new Error(`El producto con ID ${item.productoId} no pertenece a este pedido.`);
            }

            if (item.cantidad > productoPedido.cantidad) {
                throw new Error(`No puedes devolver más productos (${item.cantidad}) de los que compraste (${productoPedido.cantidad}).`);
            }
        }

        const devolucion = await devolucionesData.createDevolucion({
            pedidoId,
            motivo: motivoGeneral || (tipoDevolucion === "completa" ? "Devolución completa del pedido" : "Devolución parcial"),
            estadoId: estadoDevolucion,
            fechaDevolucion: new Date(),
        });

        let stockIncrementado = false;

        for (const item of productosDevueltos) {
            await devolucionesData.agregarProductoADevolucion({
                devolucionId: devolucion.id,
                productoId: item.productoId,
                cantidad: item.cantidad,
                motivo: item.motivo,
                estadoId: 9,
            });

            if (item.motivo.toLowerCase().includes("error")) {
                await ProductosData.incremetarStock(item.productoId, item.cantidad);
                stockIncrementado = true;
            }
        }

        if (tipoDevolucion === "completa") {
            await pedidosData.actualizarEstadoPedido(pedidoId, 5);
        }

        return {
            mensaje: `Devolución ${tipoDevolucion} registrada correctamente.`,
            devolucion,
            stockAjustado: stockIncrementado ? "Stock actualizado para productos con error de envío" : "No se realizaron cambios en stock"
        };
    },

    async actualizarEstadoDevolucion(devolucionId, nuevoEstadoId) {
        const devolucion = await devolucionesData.getDevolucionById(devolucionId);
        if (!devolucion) {
            throw new Error(`No se encontró una devolución con ID ${devolucionId}.`);
        }

        const usuarioIdRelacionado = devolucion.pedido?.usuarioId;
        if (!usuarioIdRelacionado) {
            throw new Error('El pedido asociado a esta devolución no tiene un usuario relacionado.');
        }

        const estadosValidos = {
            5: [6, 7],
            6: [8],
            7: [],
        };

        if (!estadosValidos[devolucion.estadoId]?.includes(nuevoEstadoId)) {
            throw new Error('La transición de estado no es válida.');
        }

        if (nuevoEstadoId === 6) {
            const productosDevueltos = await devolucionesData.getProductosByDevolucionId(devolucionId);
            for (const item of productosDevueltos) {
                if (item.motivo.toLowerCase().includes("error")) {
                    await ProductosData.incremetarStock(item.productoId, item.cantidad);
                }
            }
        }

        if (nuevoEstadoId === 7) {
            console.log(`La devolución ${devolucionId} ha sido rechazada. No se realizarán cambios en stock.`);
        }

        if (nuevoEstadoId === 8) {
            console.log(`La devolución ${devolucionId} ha sido completada.`);
        }

        const devolucionActualizada = await devolucionesData.updateDevolucion(devolucionId, {
            estadoId: nuevoEstadoId,
            fechaResolucion: new Date(),
        });

        return {
            mensaje: 'Estado de devolución actualizado correctamente.',
            devolucion: devolucionActualizada,
        };
    },

    async actualizarEstadoProductoDevuelto(devolucionId, productoId, nuevoEstadoId) {
        const productoDevuelto = await devolucionesData.getProductoDevolucion(devolucionId, productoId);
        if (!productoDevuelto) {
            throw new Error(`No se encontró el producto con ID ${productoId} en la devolución ${devolucionId}.`);
        }

        // Validar que el estado de la transición sea válido
        const estadosValidos = {
            9: [10, 11, 12], // Producto Pendiente → Producto Aceptado, Rechazado o Devuelto por Error
            10: [], // Producto Aceptado (final)
            11: [], // Producto Rechazado (final)
            12: []  // Producto Devuelto por Error (final)
        };

        if (!estadosValidos[productoDevuelto.estadoId]?.includes(nuevoEstadoId)) {
            throw new Error('La transición de estado del producto no es válida.');
        }

        if (nuevoEstadoId === 12) {
            await ProductosData.incremetarStock(productoId, productoDevuelto.cantidad);
        }

        const productoActualizado = await devolucionesData.updateEstadoProductoDevolucion(devolucionId, productoId, nuevoEstadoId);

        return {
            mensaje: 'Estado del producto devuelto actualizado correctamente.',
            productoDevuelto: productoActualizado,
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
