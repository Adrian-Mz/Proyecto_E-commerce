import { pedidosData } from '../data/pedidos.data.js';
import { carritoData } from '../data/carrito.data.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pedidosService = {
  async crearPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, productos = []) {
    let carritoProductos = productos;

    // Validar que la dirección de envío sea válida
    if (!direccionEnvio || typeof direccionEnvio !== 'string' || direccionEnvio.trim() === '') {
      throw new Error('La dirección de envío no es válida.');
    }

    // Si no hay productos en el body, obtenerlos del carrito
    if (!productos || productos.length === 0) {
      const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
      if (!carrito || !carrito.productos || carrito.productos.length === 0) {
        throw new Error('El carrito está vacío. No se puede realizar el pedido.');
      }
      carritoProductos = carrito.productos.map((item) => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      }));
    }

    // Validar stock disponible
    for (const item of carritoProductos) {
      const producto = await prisma.productos.findUnique({
        where: { id: item.productoId },
      });

      if (!producto) {
        throw new Error(`El producto con ID ${item.productoId} no existe.`);
      }

      if (producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`
        );
      }
    }

    // Validar métodos de pago y envío
    const metodosPago = await pedidosData.getMetodosPago();
    const metodosEnvio = await pedidosData.getMetodosEnvio();

    const metodosPagoIds = metodosPago.map((metodo) => metodo.id);
    const metodosEnvioIds = metodosEnvio.map((metodo) => metodo.id);

    if (!metodosPagoIds.includes(metodoPagoId)) {
      throw new Error('Método de pago no válido.');
    }

    if (!metodosEnvioIds.includes(metodoEnvioId)) {
      throw new Error('Método de envío no válido.');
    }

    // Calcular el total
    const total = carritoProductos.reduce(
      (sum, p) => sum + p.cantidad * p.precio_unitario,
      0
    );

    // Crear el pedido
    const pedido = await pedidosData.createPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      carritoProductos
    );

    // Reducir stock de los productos
    for (const item of carritoProductos) {
      await prisma.productos.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    // Limpiar el carrito
    await carritoData.clearCarrito(usuarioId);

    return { pedido, total };
  },
};
