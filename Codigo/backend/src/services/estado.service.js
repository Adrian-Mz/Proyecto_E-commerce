import { PrismaClient } from "@prisma/client";
import { estadoData } from "../data/estado.data.js";

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
      include: { estado: true },
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
  
    // Actualizar el estado del pedido
    const pedidoActualizado = await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId, fechaActualizacion: new Date() },
    });
  
    // Si el estado es 'Entregado'
    if (nuevoEstadoId === 4) {
      return {
        mensaje: "El pedido ha finalizado correctamente.",
        pedido: pedidoActualizado,
      };
    }
  
    return {
      mensaje: "Estado actualizado correctamente.",
      pedido: pedidoActualizado,
    };
  }  
};
