import { pedidosData } from '../data/pedidos.data.js';
import { carritoData } from '../data/carrito.data.js';
import { PrismaClient } from '@prisma/client';
import { estadoData } from '../data/estado.data.js';

const prisma = new PrismaClient();

export const pedidosService = {
  // Crear un nuevo pedido
  async crearPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, productos = []) {
    if (!direccionEnvio?.trim()) {
      throw new Error('La dirección de envío es obligatoria.');
    }

    // Obtener productos del carrito si no se especifican
    const carritoProductos = productos.length
      ? productos
      : await this.obtenerProductosDesdeCarrito(usuarioId);

    await this.validarStock(carritoProductos);
    await this.validarMetodos(metodoPagoId, metodoEnvioId);

    const total = this.calcularTotal(carritoProductos);

    const pedido = await pedidosData.createPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      carritoProductos
    );

    await this.reducirStock(carritoProductos);
    await carritoData.clearCarrito(usuarioId);

    return { pedido, total };
  },

  // Obtener un pedido específico por usuario
  async obtenerPedidoDeUsuario(usuarioId, pedidoId) {
    if (!usuarioId || !pedidoId) {
      throw new Error('El usuarioId y pedidoId son obligatorios.');
    }

    const pedido = await pedidosData.getPedidoById(pedidoId, usuarioId);
    if (!pedido) {
      throw new Error('El pedido no existe o no pertenece al usuario.');
    }

    return pedido;
  },

  // Obtener productos desde el carrito
  async obtenerProductosDesdeCarrito(usuarioId) {
    const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito?.productos?.length) {
      throw new Error('El carrito está vacío. No se puede realizar el pedido.');
    }
    return carrito.productos.map((item) => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
    }));
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
  async validarMetodos(metodoPagoId, metodoEnvioId) {
    const [metodosPago, metodosEnvio] = await Promise.all([
      pedidosData.getMetodosPago(),
      pedidosData.getMetodosEnvio(),
    ]);

    const metodosPagoIds = metodosPago.map((metodo) => metodo.id);
    const metodosEnvioIds = metodosEnvio.map((metodo) => metodo.id);

    if (!metodosPagoIds.includes(metodoPagoId)) {
      throw new Error('Método de pago no válido.');
    }

    if (!metodosEnvioIds.includes(metodoEnvioId)) {
      throw new Error('Método de envío no válido.');
    }
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

  // Actualizar el estado de pedido
  async actualizarEstado(pedidoId, nuevoEstadoId) {
    const estado = await estadoData.getEstadoById(nuevoEstadoId);
    if (!estado) {
      throw new Error('El estado proporcionado no es válido.');
    }

    return await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId },
    });
  },

};
