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
      include: { estado: true }, // Incluye el estado actual
    });

    if (!pedidoActual) {
      throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
    }

    // Validar flujo lógico de estados
    const estadosValidos = {
      "Pendiente": ["Procesando"],
      "Procesando": ["Enviado", "Cancelado"],
      "Enviado": ["Entregado"],
      "Entregado": [],
    };

    const estadoActualNombre = pedidoActual.estado.nombre;
    if (!estadosValidos[estadoActualNombre].includes(estado.nombre)) {
      throw new Error(
        `No se puede cambiar el estado de '${estadoActualNombre}' a '${estado.nombre}'.`
      );
    }

    // Actualizar el estado del pedido
    const pedidoActualizado = await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId },
    });

    // Si el estado es 'Entregado', limpiar los productos del pedido
    if (nuevoEstadoId === 4) {
      // Eliminar productos asociados al pedido
      await prisma.pedido_productos.deleteMany({
        where: { pedidoId },
      });

      // Aquí podrías limpiar más datos relacionados si es necesario
      return {
        mensaje: "El pedido ha finalizado y sus datos han sido limpiados.",
        pedido: pedidoActualizado,
      };
    }

    return {
      mensaje: "Estado actualizado correctamente.",
      pedido: pedidoActualizado,
    };
  },
};
