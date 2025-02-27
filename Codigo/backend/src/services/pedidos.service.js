import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import fs from 'fs';
import path from 'path';
import { pedidosData } from '../data/pedidos.data.js';
import { carritoData } from '../data/carrito.data.js';
import { estadoData } from '../data/estado.data.js';
import { enviarCorreo } from '../utils/emailService.js';
import { crearPagoStripe, confirmarPagoBackend } from '../utils/stripeservicios.js';
import {generarFacturaPedido} from './factura.service.js'
import {auditoriaService} from '../services/auditoria.service.js'
import { notificacionesService } from '../services/notificaciones.service.js';

// Obtener __dirname en módulos ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear una carpeta para archivos generados si no existe
const archivosDir = path.join(__dirname, '..', 'archivos');
if (!fs.existsSync(archivosDir)) {
  fs.mkdirSync(archivosDir, { recursive: true });
}

const prisma = new PrismaClient();

export const pedidosService = {
  
  // Obtener pedidos según el contexto (usuario autenticado o administrador)
  async obtenerPedidos({ usuarioId = null, pedidoId = null, esAdmin = false }) {
    let pedidos;

    if (pedidoId) {
      pedidos = await pedidosData.getPedidoById(pedidoId, usuarioId);
    } else if (esAdmin) {
      pedidos = await pedidosData.getAllPedidos(); // Aquí se cargan todos los pedidos
    } else if (usuarioId) {
      pedidos = await pedidosData.getPedidosByUsuarioId(usuarioId);
    } else {
      throw new Error('Parámetros incorrectos para obtener pedidos.');
    }

    // Obtener historial de cambios de estado para cada pedido
    for (let pedido of pedidos) {
      pedido.historialEstados = await pedidosData.getHistorialEstadosPedido(pedido.id);
    }

    return pedidos;
  },

  // Crear un nuevo pedido
  async crearPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, detallesPago) {
    console.log("Iniciando creación de pedido");

    if (!direccionEnvio?.trim()) {
      throw new Error("La dirección de envío es obligatoria.");
    }

    const metodoPago = await this.validarMetodoPago(metodoPagoId);
    const metodoEnvio = await this.validarMetodoEnvio(metodoEnvioId);

    if (metodoPago.nombre !== "debito" && metodoPago.nombre !== "credito") {
      throw new Error(`El método de pago ${metodoPago.nombre} no está permitido. Selecciona débito o crédito.`);
    }

    const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito || !carrito.productos || carrito.productos.length === 0) {
      throw new Error("El carrito está vacío. Agrega productos antes de confirmar el pedido.");
    }

    const totalProductos = carrito.productos.reduce(
      (sum, item) => sum + item.cantidad * parseFloat(item.precio_unitario),
      0
    );

    const costoEnvio = metodoEnvio?.costo ? parseFloat(metodoEnvio.costo) : 0;
    const total = totalProductos + costoEnvio;

    console.log("Total calculado:", { totalProductos, costoEnvio, total });

    console.log("Creando pedido en la base de datos");
    const pedido = await pedidosData.createPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      carrito.productos,
      total
    );

    console.log("Pedido creado:", pedido);
    const pedidoId = pedido.id;

    let clientSecret = null;
    try {
      const descripcion = `Pago del pedido #${pedidoId}`;
      const stripePayment = await crearPagoStripe(
        total,
        "usd",
        detallesPago.correoContacto,
        descripcion
      );

      clientSecret = stripePayment.clientSecret;

      const paymentIntent = await confirmarPagoBackend(stripePayment.paymentIntentId, detallesPago);

      await this.registrarPago(pedidoId, metodoPagoId, {
        ...detallesPago,
        monto: total,
      });

      console.log(`Pago procesado correctamente para el pedido #${pedidoId}`);
    } catch (error) {
      console.error("Error al procesar el pago con Stripe:", error.message);
      throw new Error("No se pudo procesar el pago.");
    }

    await this.reducirStock(carrito.productos);

    console.log("Vaciando carrito");
    const carritoLimpio = await carritoData.clearCarrito(carrito.id);
    if (!carritoLimpio || carritoLimpio.count === 0) {
      throw new Error("Hubo un problema al vaciar el carrito. Intenta nuevamente.");
    }

    try {
      console.log("Preparando PDF de confirmación");
      const pedidoDetalles = await pedidosData.getPedidoById(pedidoId, usuarioId);
      const pdfPath = path.join(archivosDir, `pedido_${pedidoId}.pdf`);

      // Generar factura
      await generarFacturaPedido(pedidoDetalles, pdfPath);

      console.log("PDF generado en:", pdfPath);

      // Enviar correo con el PDF adjunto
      const mensajeCorreo = `
        <h1>Gracias por tu pedido</h1>
        <p>Hola ${pedidoDetalles.usuario.nombre},</p>
        <p>Adjuntamos un PDF con los detalles de tu pedido.</p>
      `;

      await enviarCorreo(pedidoDetalles.usuario.correo, `Confirmación de tu pedido #${pedidoId}`, mensajeCorreo, pdfPath);

      console.log(`Correo enviado con éxito a ${pedidoDetalles.usuario.correo}`);

      // Eliminar el PDF después de enviarlo
      fs.unlinkSync(pdfPath);
      console.log("PDF eliminado del servidor");
    } catch (error) {
      console.error("Error al generar o enviar el PDF de confirmación:", error.message);
    }

    // ✅ Registrar Auditoría de Creación de Pedido
    await auditoriaService.registrarEvento(
      usuarioId,
      "pedidos",
      "CREAR",
      pedido,
      `Pedido #${pedidoId} creado con total de $${total}.`
    );

    // ✅ Enviar notificación a los administradores
    const administradores = await prisma.usuarios.findMany({
      where: { rol: { nombre: "Administrador" } },
      select: { id: true },
    });

    for (const admin of administradores) {
      await notificacionesService.crearNotificacion(
        admin.id,
        `Nuevo pedido #${pedidoId} creado.`,
        "pedido_nuevo"
      );
    }

    return {
      mensaje: "Pedido y pago registrados con éxito. Carrito vaciado.",
      pedido,
      clientSecret,
    };
  },

  // Función para verificar si una promoción está activa
  esPromocionActiva(fechaInicio, fechaFin) {
    const ahora = new Date();
    return (
      (!fechaInicio || new Date(fechaInicio) <= ahora) &&
      (!fechaFin || new Date(fechaFin) >= ahora)
    );
  },  

  // Eliminar un pedido
  async eliminarPedido(pedidoId) {
    // Verificar si el pedido existe
    const pedido = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
    });

    if (!pedido) {
      throw new Error(`El pedido con ID ${pedidoId} no existe.`);
    }

    // Eliminar registros relacionados en la tabla Pedidos_Productos
    await prisma.pedido_productos.deleteMany({
      where: { pedidoId },
    });

    // Eliminar registros relacionados en la tabla Pagos
    await prisma.pagos.deleteMany({
      where: { pedidoId },
    });

    // Eliminar el pedido
    await prisma.pedidos.delete({
      where: { id: pedidoId },
    });

    return { mensaje: `El pedido con ID ${pedidoId} ha sido eliminado exitosamente.` };
  },

  // Validar stock
  async validarStock(carritoProductos) {
    for (const item of carritoProductos) {
      const producto = await prisma.productos.findUnique({
        where: { id: item.productoId },
      });

      if (!producto) {
        throw new Error(`El producto con ID ${item.productoId} no existe.`);
      }

      if (producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}.`
        );
      }
    }
  },

  // Validar métodos de pago y envío
  async validarMetodoPago(metodoPagoId) {
    const metodoPago = await prisma.metodo_pago.findUnique({
      where: { id: metodoPagoId },
    });
    if (!metodoPago) {
      throw new Error('El método de pago seleccionado no es válido.');
    }
    return metodoPago;
  },

  async validarMetodoEnvio(metodoEnvioId) {
    const metodoEnvio = await prisma.metodo_envio.findUnique({
      where: { id: metodoEnvioId },
    });
    if (!metodoEnvio) {
      throw new Error('El método de envío seleccionado no es válido.');
    }
    return metodoEnvio;
  },

  // Calcular total de productos
  calcularTotal(carritoProductos) {
    return carritoProductos.reduce(
      (sum, { cantidad, precio_unitario }) => sum + cantidad * precio_unitario,
      0
    );
  },

  // Reducir stock de productos
  async reducirStock(carritoProductos) {
    for (const item of carritoProductos) {
      await prisma.productos.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }
  },

  // Registrar pago
  async registrarPago(pedidoId, metodoPagoId, detallesPago) {
    return await prisma.pagos.create({
      data: {
        pedidoId,
        metodoPagoId,
        numeroTarjeta: detallesPago.numeroTarjeta.slice(-4), // Guardar solo los últimos 4 dígitos
        nombreTitular: detallesPago.nombreTitular,
        fechaExpiracion: detallesPago.fechaExpiracion,
        correoContacto: detallesPago.correoContacto,
        telefonoContacto: detallesPago.telefonoContacto,
        monto: detallesPago.monto,
      },
    });
  },

  // Actualizar el estado de pedido
  async actualizarEstado(pedidoId, nuevoEstadoId) {
    const estado = await estadoData.getEstadoById(nuevoEstadoId);
    if (!estado) {
      throw new Error('El estado proporcionado no es válido.');
    }

    // Iniciar una transacción para actualizar el pedido y registrar el historial
    const [pedidoActualizado] = await prisma.$transaction([
      prisma.pedidos.update({
        where: { id: pedidoId },
        data: { 
          estadoId: nuevoEstadoId,
          fechaActualizacion: new Date()
        },
        include: {
          usuario: true,
          estado: true,
        },
      }),
      prisma.historial_estado_pedidos.create({
        data: {
          pedidoId,
          estadoId: nuevoEstadoId,
        },
      }),
    ]);

    // ✅ Enviar notificación al usuario sobre el cambio de estado
    await notificacionesService.crearNotificacion(
      pedidoActualizado.usuario.id,
      `El estado de tu pedido #${pedidoId} cambió a ${pedidoActualizado.estado.nombre}.`,
      "estado_actualizado"
    );

    return pedidoActualizado;
  },

  // Obtener estado del pedido por ID
  async obtenerEstadoPedido(pedidoId) {
    const pedido = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
      include: {
        estado: true,
        metodoEnvio: true, // Incluye detalles del método de envío
      },
    });

    if (!pedido) {
      throw new Error(`No se encontró un pedido con el ID ${pedidoId}.`);
    }

    // Calcula la fecha estimada de entrega
    const fechaEstimadaEntrega = pedido.metodoEnvio
      ? calcularFechaEntrega(pedido.fechaPedido, pedido.metodoEnvio.tiempoEstimado)
      : null;

    return {
      id: pedido.id,
      estado: pedido.estado.nombre,
      descripcionEstado: pedido.estado.descripcion,
      fechaPedido: pedido.fechaPedido,
      fechaEstimadaEntrega,
      total: pedido.total,
    };
  },
};

  // Función para calcular la fecha estimada de entrega
  function calcularFechaEntrega(fechaPedido, tiempoEstimado) {
    const rangoDias = tiempoEstimado.match(/\d+/g); // Extrae los números del rango
    if (!rangoDias || rangoDias.length === 0) {
      return null;
    }

    const diasMinimos = parseInt(rangoDias[0], 10);
    const diasMaximos = rangoDias.length > 1 ? parseInt(rangoDias[1], 10) : diasMinimos;

    // Por simplicidad, usamos el rango máximo para la estimación
    const fecha = new Date(fechaPedido);
    fecha.setDate(fecha.getDate() + diasMaximos);

    return fecha;
  }