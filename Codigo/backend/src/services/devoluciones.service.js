import { devolucionesData } from "../data/devoluciones.data.js";
import { pedidosData } from "../data/pedidos.data.js";
import { ProductosData } from "../data/productos.data.js";

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
    
        // 🔴 **Verificar si ya hay una devolución activa para este producto**
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

        return await devolucionesData.updateDevolucion(devolucionId, {
            estadoId: nuevoEstadoId,
            fechaResolucion: new Date(),
        });
    }
};
