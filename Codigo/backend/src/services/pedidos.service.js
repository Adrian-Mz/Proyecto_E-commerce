import { pedidosData } from '../data/pedidos.data.js';
import { carritoData } from '../data/carrito.data.js';
import { ProductosData } from '../data/productos.data.js';

export const PedidosService = {
  async realizarPedido(usuarioId, direccionEnvio, metodoPago) {
    // Validar datos de entrada
    if (!direccionEnvio) {
      throw new Error('La dirección de envío es obligatoria.');
    }

    // Validar método de pago
    const metodosPagoValidos = await pedidosData.getMetodosPago();
    if (!metodosPagoValidos.includes(metodoPago)) {
      throw new Error(`Método de pago inválido. Métodos válidos: ${metodosPagoValidos.join(', ')}`);
    }

    // Obtener carrito del usuario
    const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito || carrito.productos.length === 0) {
      throw new Error('El carrito está vacío.');
    }

    // Validar stock de productos
    for (const item of carrito.productos) {
      const producto = await ProductosData.getProductoById(item.productoId);
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${item.productoId}`);
      }
    }

    // Registrar el pedido
    const productosPedido = carrito.productos.map((p) => ({
      productoId: p.productoId,
      cantidad: p.cantidad,
      precio_unitario: p.producto.precio,
    }));

    const pedido = await pedidosData.createPedido(
      usuarioId,
      direccionEnvio,
      metodoPago,
      productosPedido
    );

    // Reducir stock de productos
    for (const item of carrito.productos) {
      await ProductosData.updateStock(item.productoId, item.cantidad);
    }

    // Limpiar el carrito
    await carritoData.clearCarrito(carrito.id);

    return pedido;
  },
};
