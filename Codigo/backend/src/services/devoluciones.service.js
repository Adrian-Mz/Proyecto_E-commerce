import { devolucionesData } from "../data/devoluciones.data.js";
import { pedidosData } from "../data/pedidos.data.js";
import { ProductosData } from "../data/productos.data.js";
import { enviarCorreo } from '../utils/emailService.js';

export const devolucionesService = {

    // Obtener todas las devoluciones
    async obtenerTodasLasDevoluciones() {
        return await devolucionesData.getAllDevoluciones();
    },

    // Obtener una devolución por ID
    async obtenerDevolucionPorId(devolucionId) {
        return await devolucionesData.getDevolucionById(devolucionId);
    },

    // Registrar una devolución de productos
    async registrarDevolucion(pedidoId, productosDevueltos) {
        const pedido = await pedidosData.getPedidoById(pedidoId);
        if (!pedido) {
            throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
        }

        if (pedido.estadoId !== 4) {
            throw new Error(`Solo se pueden solicitar devoluciones para pedidos en estado 'Entregado'.`);
        }

        let stockIncrementado = false;

        for (const item of productosDevueltos) {
            const productoPedido = pedido.productos.find(p => p.productoId === item.productoId);
            if (!productoPedido) {
                throw new Error(`El producto con ID ${item.productoId} no pertenece a este pedido.`);
            }

            if (item.cantidad > productoPedido.cantidad) {
                throw new Error(
                    `No puedes devolver más productos (${item.cantidad}) de los que compraste (${productoPedido.cantidad}).`
                );
            }

            // Verificar si ya se ha devuelto parte o la totalidad del producto en devoluciones anteriores
            const devolucionesPrevias = await devolucionesData.getProductoDevolucionByPedido(pedidoId, item.productoId);
            if (devolucionesPrevias) {
                const cantidadPreviamenteDevuelta = devolucionesPrevias.cantidad;
                const cantidadDisponibleParaDevolver = productoPedido.cantidad - cantidadPreviamenteDevuelta;

                if (item.cantidad > cantidadDisponibleParaDevolver) {
                    throw new Error(
                        `Ya has devuelto ${cantidadPreviamenteDevuelta} de este producto. Solo puedes devolver ${cantidadDisponibleParaDevolver} más.`
                    );
                }
            }
        }

        // Asegurar que la devolución se registre con estado 5 (Devolución Pendiente)**
        const devolucion = await devolucionesData.createDevolucion({
            pedidoId,
            motivo: "Devolución de productos específica",
            estadoId: 5, // Estado "Devolución Pendiente"
            fechaDevolucion: new Date(),
        });

        for (const item of productosDevueltos) {
            await devolucionesData.agregarProductoADevolucion({
                devolucionId: devolucion.id,
                productoId: item.productoId,
                cantidad: item.cantidad,
                motivo: item.motivo,
                estadoId: 9, // Estado "Producto Pendiente"
            });

            if (item.motivo.toLowerCase().includes("error")) {
                await ProductosData.incremetarStock(item.productoId, item.cantidad);
                stockIncrementado = true;
            }
        }

        return {
            mensaje: `Devolución registrada correctamente.`,
            devolucion,
            stockAjustado: stockIncrementado ? "Stock actualizado para productos con error de envío" : "No se realizaron cambios en stock",
        };
    },


    // Actualizar estado de un producto devuelto
    async actualizarEstadoProductoDevuelto(devolucionId, productoId, nuevoEstadoId) {
        const productoDevuelto = await devolucionesData.getProductoDevolucion(devolucionId, productoId);
        if (!productoDevuelto) {
            throw new Error(`No se encontró el producto con ID ${productoId} en la devolución ${devolucionId}.`);
        }
    
        // Validar que el estado de la transición sea válido
        const estadosValidos = {
            9: [10, 11, 12], // Producto Pendiente → Producto Aceptado, Rechazado o Devuelto por Error
            10: [], // Producto Aceptado (estado final)
            11: [], // Producto Rechazado (estado final)
            12: []  // Producto Devuelto por Error (estado final)
        };
    
        if (!estadosValidos[productoDevuelto.estadoId]?.includes(nuevoEstadoId)) {
            throw new Error('La transición de estado del producto no es válida.');
        }
    
        // Actualizar el estado del producto devuelto
        const productoActualizado = await devolucionesData.updateEstadoProductoDevolucion(devolucionId, productoId, nuevoEstadoId);
    
        // **Verificar si todos los productos de la devolución han sido procesados**
        const productosPendientes = await devolucionesData.countProductosPendientesDevolucion(devolucionId);
        
        if (productosPendientes === 0) {
            // **Si no hay productos en estado 9 (Pendiente), cambiar la devolución a estado 8 (Completada)**
            await devolucionesData.updateDevolucion(devolucionId, {
                estadoId: 8, // Estado "Devolución Completada"
                fechaResolucion: new Date(),
            });
    
            return {
                mensaje: 'Estado del producto devuelto actualizado correctamente y devolución completada.',
                productoDevuelto: productoActualizado,
                devolucionActualizada: true
            };
        }
    
        return {
            mensaje: 'Estado del producto devuelto actualizado correctamente.',
            productoDevuelto: productoActualizado,
            devolucionActualizada: false
        };
    },        

    async actualizarEstadoDevolucion(devolucionId, nuevoEstadoId, correoUsuario) {
        // Buscar la devolución
        const devolucion = await devolucionesData.getDevolucionById(devolucionId);
        if (!devolucion) {
            throw new Error(`No se encontró una devolución con ID ${devolucionId}.`);
        }
    
        // Obtener el usuario asociado al pedido de la devolución
        const usuarioIdRelacionado = devolucion.pedido?.usuarioId;
        if (!usuarioIdRelacionado) {
            throw new Error('El pedido asociado a esta devolución no tiene un usuario relacionado.');
        }
    
        // Validar que el cambio de estado sea válido
        const estadosValidos = {
            5: [6, 7], // Devolución Pendiente → Devolución Aceptada o Rechazada
            6: [8],    // Devolución Aceptada → Devolución Completada
            7: [],     // Devolución Rechazada (Estado final)
            8: [],     // Devolución Completada (Estado final)
        };
    
        if (!estadosValidos[devolucion.estadoId]?.includes(nuevoEstadoId)) {
            throw new Error('La transición de estado no es válida.');
        }
    
        // Si se marca como "Aceptada", verificar y actualizar productos devueltos
        if (nuevoEstadoId === 6) {
            const productosDevueltos = await devolucionesData.getProductosByDevolucionId(devolucionId);
            
            for (const item of productosDevueltos) {
                if (item.motivo.toLowerCase().includes("error")) {
                    await ProductosData.incremetarStock(item.productoId, item.cantidad);
                }
            }
        }
    
        // Actualizar el estado de la devolución en la base de datos
        const devolucionActualizada = await devolucionesData.updateDevolucion(devolucionId, {
            estadoId: nuevoEstadoId,
            fechaResolucion: new Date(),
        });
    
        // Si la devolución es aceptada, verificar si se debe completar automáticamente
        if (nuevoEstadoId === 6 || nuevoEstadoId === 7) {
            await this.verificarEstadoDevolucion(devolucionId);
        }
    
        // Si se marca como "Completada", enviar confirmación final
        if (nuevoEstadoId === 8) {
            console.log(`La devolución ${devolucionId} ha sido completada.`);
        }
    
        // Enviar correo de notificación al usuario
        await this.enviarCorreoEstadoDevolucion(correoUsuario, nuevoEstadoId, devolucion);
    
        return {
            mensaje: 'Estado de devolución actualizado correctamente.',
            devolucion: devolucionActualizada,
        };
    },    
    
    async verificarEstadoDevolucion(devolucionId) {
        const productosDevueltos = await devolucionesData.getProductosByDevolucionId(devolucionId);
    
        const productosPendientes = productosDevueltos.filter(p => p.estadoId === 9);
        const productosAceptados = productosDevueltos.filter(p => p.estadoId === 10 || p.estadoId === 12);
        const productosRechazados = productosDevueltos.filter(p => p.estadoId === 11);
    
        let nuevoEstadoDevolucion = null;
    
        if (productosPendientes.length === 0) {
            if (productosAceptados.length > 0) {
                nuevoEstadoDevolucion = 6; // "Devolución Aceptada"
            } else if (productosRechazados.length === productosDevueltos.length) {
                nuevoEstadoDevolucion = 7; // "Devolución Rechazada"
            }
        }
    
        if (nuevoEstadoDevolucion !== null) {
            await devolucionesData.updateDevolucion(devolucionId, { estadoId: nuevoEstadoDevolucion, fechaResolucion: new Date() });
        }
    
        return { mensaje: "Estado de la devolución actualizado correctamente." };
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
