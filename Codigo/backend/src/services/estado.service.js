import { estadoData } from '../data/estado.data.js';

export const estadoService = {
  // Obtener todos los estados
  async obtenerEstados() {
    return await estadoData.getAllEstados();
  },

  // Actualizar el estado del pedido
  async actualizarEstadoPedido(pedidoId, nuevoEstadoId) {
    const estado = await estadoData.getEstadoById(nuevoEstadoId);
    if (!estado) {
      throw new Error('El estado proporcionado no es válido.');
    }

    const pedidoActualizado = await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId },
    });

    return pedidoActualizado;
  },
};
