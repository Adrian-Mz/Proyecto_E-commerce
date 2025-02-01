import { PrismaClient } from "@prisma/client";
import { estadoData } from "../data/estado.data.js";
import { enviarCorreo } from "../utils/emailService.js"; // Servicio de envío de correos

const prisma = new PrismaClient();

export const estadoService = {
  // Obtener todos los estados
  async obtenerEstados() {
    return await estadoData.getAllEstados();
  },

  // Actualizar el estado del pedido
  async actualizarEstadoPedido(pedidoId, nuevoEstadoId) {
    // Verificar si el estado existe
    const estado = await estadoData.getEstadoById(nuevoEstadoId);
    if (!estado) {
      throw new Error("El estado proporcionado no es válido.");
    }
  
    // Obtener el pedido actual
    const pedidoActual = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
      include: {
        estado: true,
        usuario: true, // Incluye datos del usuario
      },
    });
  
    if (!pedidoActual) {
      throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
    }
  
    // Validar flujo lógico de estados
    const estadosValidos = {
      1: [2], // Pendiente → Procesando
      2: [3, 7], // Procesando → Enviado o Cancelado
      3: [4], // Enviado → Entregado
      4: [], // Entregado (estado final)
    };
  
    if (!estadosValidos[pedidoActual.estadoId]?.includes(nuevoEstadoId)) {
      throw new Error(
        `No se puede cambiar el estado de '${pedidoActual.estado.nombre}' a '${estado.nombre}'.`
      );
    }
  
    // Actualizar el estado del pedido y registrar en historial de estado
    const pedidoActualizado = await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId, fechaActualizacion: new Date() },
      include: {
        estado: true,
        usuario: true,
      },
    });
  
    // Registrar el cambio en historial_estado_pedidos
    await prisma.historial_estado_pedidos.create({
      data: {
        pedidoId,
        estadoId: nuevoEstadoId,
        fechaCambio: new Date(),
      },
    });
  
    // Enviar correo al cliente sobre el cambio de estado
    await this.enviarNotificacionEstado(pedidoActualizado);
  
    return {
      mensaje: "Estado actualizado correctamente.",
      pedido: pedidoActualizado,
    };
  },  

  // Enviar notificación por correo al cliente
  async enviarNotificacionEstado(pedido) {
    const { usuario, estado } = pedido;
    if (!usuario || !usuario.correo) {
      console.error("No se pudo enviar el correo: El usuario no tiene un correo registrado.");
      return;
    }

    const asunto = `Actualización del estado de tu pedido #${pedido.id}`;
    const mensaje = `
      <h1>Hola ${usuario.nombre},</h1>
      <p>El estado de tu pedido <strong>#${pedido.id}</strong> ha cambiado a: <strong>${estado.nombre}</strong>.</p>
      <p>${this.obtenerDescripcionEstado(estado.nombre)}</p>
      <p>Gracias por confiar en nosotros.</p>
      <p>Atentamente,</p>
      <p>El equipo de Tu E-commerce</p>
    `;

    try {
      await enviarCorreo(usuario.correo, asunto, mensaje);
      console.log(`Correo enviado a ${usuario.correo} sobre el cambio de estado.`);
    } catch (error) {
      console.error("Error al enviar el correo:", error.message);
    }
  },

  // Obtener descripción personalizada para cada estado
  obtenerDescripcionEstado(estadoNombre) {
    const descripciones = {
      Pendiente: "Estamos revisando los detalles de tu pedido.",
      Procesando: "Tu pedido está siendo preparado para el envío.",
      Enviado: "Tu pedido está en camino. Pronto llegará a tu dirección.",
      Entregado: "Tu pedido ha sido entregado. ¡Esperamos que lo disfrutes!",
      Cancelado: "Tu pedido ha sido cancelado. Si tienes preguntas, contáctanos.",
    };

    return descripciones[estadoNombre] || "Estado actualizado.";
  },
};
