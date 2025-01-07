import { PrismaClient } from '@prisma/client';
import { pedidosData } from '../data/pedidos.data.js';
import { carritoData } from '../data/carrito.data.js';
import { estadoData } from '../data/estado.data.js';

const prisma = new PrismaClient();

export const pedidosService = {
  // Crear un nuevo pedido
  async crearPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, detallesPago) {
    if (!direccionEnvio?.trim()) {
      throw new Error('La dirección de envío es obligatoria.');
    }

    // Validar métodos de pago y envío
    const metodoPago = await this.validarMetodoPago(metodoPagoId);
    const metodoEnvio = await this.validarMetodoEnvio(metodoEnvioId);

    // Verificar si ya existe un pedido en proceso
    const pedidoExistente = await prisma.pedidos.findFirst({
      where: {
        usuarioId,
        estadoId: 1, // Estado "Procesando"
      },
    });
    if (pedidoExistente) {
      throw new Error(
        'Ya tienes un pedido en proceso. Si deseas agregar más productos, realiza un nuevo pedido desde el carrito.'
      );
    }

    // Obtener productos directamente desde el carrito
    const carritoProductos = await this.obtenerProductosDesdeCarrito(usuarioId);

    if (!carritoProductos || carritoProductos.length === 0) {
      throw new Error('El carrito está vacío. Agrega productos antes de confirmar el pedido.');
    }

    // Validar stock
    await this.validarStock(carritoProductos);

    // Calcular el costo total del pedido
    const totalProductos = this.calcularTotal(carritoProductos);
    const costoEnvio = parseFloat(metodoEnvio.costo);
    const total = totalProductos + costoEnvio;

    // Crear el pedido
    const pedido = await pedidosData.createPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      carritoProductos
    );

    // Registrar el pago
    await this.registrarPago(pedido.id, metodoPagoId, {
      ...detallesPago,
      monto: total,
    });

    // Reducir el stock y limpiar el carrito
    await this.reducirStock(carritoProductos);
    await carritoData.clearCarrito(usuarioId);

    return { mensaje: 'Pedido y pago registrados con éxito', pedido, total };
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

    return await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId },
    });
  },
};
