import { PrismaClient } from '@prisma/client';
import { devolucionesData } from "../data/devoluciones.data.js";
import { pedidosData } from "../data/pedidos.data.js";
import { ProductosData } from "../data/productos.data.js";
import { enviarCorreo } from "../utils/emailService.js";
import { notificacionesService } from '../services/notificaciones.service.js';

const prisma = new PrismaClient();

export const devolucionesService = {

    // Obtener todas las devoluciones
    async obtenerTodasLasDevoluciones() {
        return await devolucionesData.getAllDevoluciones();
    },

    // Obtener una devolución específica
    async obtenerDevolucionPorId(devolucionId) {
        return await devolucionesData.getDevolucionById(devolucionId);
    },

    async obtenerProductosElegibles(usuarioId) {
        // Obtener pedidos en estado "Entregado" (estadoId = 4)
        const pedidosEntregados = await pedidosData.getPedidosEntregados(usuarioId);
        
        let productosElegibles = [];
        
        for (const pedido of pedidosEntregados) {
            for (const producto of pedido.productos) {
                // Verificar si ya tiene una devolución activa
                const devolucionExistente = await devolucionesData.getDevolucionByProducto(pedido.id, producto.productoId);
                if (!devolucionExistente) {
                    productosElegibles.push({
                        pedidoId: pedido.id,
                        productoId: producto.productoId,
                        nombre: producto.producto.nombre,
                        cantidad: producto.cantidad,
                        precio: producto.producto.precio,
                        imagen: producto.producto.imagen
                    });
                }
            }
        }
    
        return productosElegibles;
    },
    

    // Registrar una devolución para un producto
    async registrarDevolucion(pedidoId, productoId, cantidad, motivo) {
        const pedido = await pedidosData.getPedidoById(pedidoId);
        if (!pedido) throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
    
        if (pedido.estadoId !== 4) throw new Error(`Solo se pueden devolver productos de pedidos entregados.`);
    
        // Buscar el producto dentro del pedido
        const productoPedido = pedido.productos.find(p => p.productoId === productoId);
        if (!productoPedido) throw new Error(`El producto con ID ${productoId} no pertenece a este pedido.`);
    
        // **Verificar si ya hay una devolución activa para este producto**
        const devolucionExistente = await devolucionesData.getDevolucionByProducto(pedidoId, productoId);
        if (devolucionExistente) {
            throw new Error(`Este producto ya está en proceso de devolución.`);
        }
    
        // Obtener devoluciones previas de este producto
        const devolucionesPrevias = await devolucionesData.getDevolucionByProducto(pedidoId, productoId);
        let cantidadDevueltaPrevio = devolucionesPrevias ? devolucionesPrevias.cantidad : 0;
    
        // Calcular la cantidad restante disponible para devolver
        let cantidadDisponible = productoPedido.cantidad - cantidadDevueltaPrevio;
    
        if (cantidad > cantidadDisponible) {
            throw new Error(`Ya has devuelto ${cantidadDevueltaPrevio} unidades. Solo puedes devolver ${cantidadDisponible} más.`);
        }
    
        // Calcular el monto a reembolsar (con 5% de descuento administrativo)
        let montoProducto = cantidad * productoPedido.precio;
        let montoFinal = montoProducto * 0.95;
    
        // Registrar la devolución
        const devolucion = await devolucionesData.createDevolucion({
            pedidoId,
            productoId,
            cantidad,
            motivo
        });
    
        // ✅ Si el motivo indica un error en el envío, aumentar el stock
        if (motivo.toLowerCase().includes("error") || motivo.toLowerCase().includes("envío incorrecto")) {
            await ProductosData.incremetarStock(productoId, cantidad);
        }

        // ** Enviar correo al usuario con instrucciones**
        const asunto = "Instrucciones para tu devolución en TrendShop";
        const contenido = `
            <p>Hola,</p>
            <p>Hemos recibido tu solicitud de devolución para el producto <strong>${productoPedido.nombre}</strong>.</p>
            <p>Por favor, adjunta las siguientes evidencias y envíalas a nuestro equipo:</p>
            <ul>
                <li>Fotos del producto empaquetado.</li>
                <li>Captura del pedido generado.</li>
            </ul>
            <p>Responderemos en un máximo de 48 horas.</p>
            <p>Gracias por confiar en TrendShop.</p>
        `;
        await enviarCorreo(pedido.usuario.correo, asunto, contenido);

        // ✅ Enviar notificación a los administradores
        try {
            const administradores = await prisma.usuarios.findMany({
                where: { rol: { nombre: "Administrador" } },
                select: { id: true },
            });

            for (const admin of administradores) {
                console.log(`Enviando notificación al admin ID: ${admin.id}`);
                await notificacionesService.crearNotificacion(
                    admin.id,
                    `Nueva devolución registrada para el pedido #${pedidoId}.`,
                    "devolucion_nueva"
                );
            }
        } catch (error) {
            console.error("Error enviando notificaciones a administradores:", error);
        }
    
        return {
            mensaje: `Devolución registrada correctamente.`,
            devolucion,
            montoReembolsado: montoFinal
        };
    },

    // Actualizar estado de una devolución
    async actualizarEstadoDevolucion(devolucionId, nuevoEstadoId) {
        const devolucion = await devolucionesData.getDevolucionById(devolucionId);
        if (!devolucion) throw new Error(`No se encontró la devolución con ID ${devolucionId}.`);

        // Solo permitir ciertos cambios de estado
        const estadosValidos = {
            5: [6, 7], // Pendiente → Aceptada o Rechazada
            6: [8],    // Aceptada → Completada
            7: [],     // Rechazada (Final)
            8: []      // Completada (Final)
        };

        if (!estadosValidos[devolucion.estadoId]?.includes(nuevoEstadoId)) {
            throw new Error(`Cambio de estado no permitido.`);
        }

        // Si la devolución se completa, se procesa el reembolso
        if (nuevoEstadoId === 8) {
            await devolucionesData.updateDevolucion(devolucionId, {
                montoReembolsado: devolucion.cantidad * devolucion.producto.precio * 0.95
            });
        }

        await devolucionesData.updateDevolucion(devolucionId, {
            estadoId: nuevoEstadoId,
            fechaResolucion: new Date(),
        });

        // ** Enviar notificación de cambio de estado**
        let asunto = "Actualización en tu devolución";
        let contenido = "";

        switch (nuevoEstadoId) {
            case 6: // Aceptada
                asunto = "Tu devolución ha sido aceptada";
                contenido = `
                    <p>Hola,</p>
                    <p>Tu devolución del producto <strong>${devolucion.producto.nombre}</strong> ha sido aceptada.</p>
                    <p>Pronto recibirás más detalles sobre el reembolso.</p>
                    <p>Gracias por confiar en TrendShop.</p>
                `;
                break;
            case 7: // Rechazada
                asunto = "Tu devolución ha sido rechazada";
                contenido = `
                    <p>Hola,</p>
                    <p>Lamentamos informarte que tu solicitud de devolución del producto <strong>${devolucion.producto.nombre}</strong> ha sido rechazada.</p>
                    <p>Si tienes alguna duda, por favor contáctanos.</p>
                `;
                break;
            case 8: // Completada
                asunto = "Tu devolución ha sido completada";
                contenido = `
                    <p>Hola,</p>
                    <p>Tu devolución ha sido procesada exitosamente y el reembolso se ha completado.</p>
                    <p>Gracias por confiar en TrendShop.</p>
                `;
                break;
        }

        await enviarCorreo(devolucion.pedido.usuario.correo, asunto, contenido);

        // Obtener el nombre del estado antes de enviarlo
        const estado = await devolucionesData.getEstadoById(nuevoEstadoId);
        const nombreEstado = estado ? estado.nombre : "Desconocido"; // Si no encuentra el estado, muestra "Desconocido"

        // ✅ Enviar notificación al usuario con el nombre del estado
        try {
            console.log(`Enviando notificación al usuario ID: ${devolucion.pedido.usuarioId}`);
            await notificacionesService.crearNotificacion(
                devolucion.pedido.usuarioId, // ID del usuario que hizo la devolución
                `El estado de tu devolución #${devolucionId} ha cambiado a "${nombreEstado}".`,
                "devolucion_actualizada"
            );
        } catch (error) {
            console.error("Error enviando notificación al usuario:", error);
        }
    }
};
