import { PrismaClient } from '@prisma/client';
import { pedidosData } from '../data/pedidos.data.js';
import { carritoData } from '../data/carrito.data.js';
import { estadoData } from '../data/estado.data.js';
import { enviarCorreo } from '../utils/emailService.js';

const prisma = new PrismaClient();

export const pedidosService = {
  
  async obtenerHistorialPedidosUsuario(usuarioId) {
    if (!usuarioId) {
      throw new Error('El ID del usuario es obligatorio.');
    }
  
    const pedidos = await pedidosData.getPedidosByUsuarioId(usuarioId);
  
    if (!pedidos || pedidos.length === 0) {
      throw new Error('No se encontraron pedidos para este usuario.');
    }
  
    return pedidos;
  },

  // Obtener todos los pedidos de un usuario específico
   async obtenerPedidosDeUsuario(usuarioId) {
    if (!usuarioId) {
      throw new Error('El ID del usuario es obligatorio.');
    }

    const pedidos = await pedidosData.getPedidosByUsuarioId(usuarioId);
    if (!pedidos || pedidos.length === 0) {
      throw new Error('No se encontraron pedidos para este usuario.');
    }

    return pedidos;
  },

  // Obtener todos los pedidos (solo para administradores)
  async obtenerTodosLosPedidos() {
    const pedidos = await pedidosData.getAllPedidos();
    if (!pedidos || pedidos.length === 0) {
      throw new Error('No se encontraron pedidos en el sistema.');
    }

    return pedidos;
  },

  // Crear un nuevo pedido
  async crearPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, detallesPago) {
    if (!direccionEnvio?.trim()) {
      throw new Error('La dirección de envío es obligatoria.');
    }

    // Validar métodos de pago y envío
    const metodoPago = await this.validarMetodoPago(metodoPagoId);
    const metodoEnvio = await this.validarMetodoEnvio(metodoEnvioId);
    
    // Obtener productos desde el carrito
    const carrito = await carritoData.getCarritoByUsuarioId(usuarioId);
    if (!carrito || !carrito.productos || carrito.productos.length === 0) {
      throw new Error('El carrito está vacío. Agrega productos antes de confirmar el pedido.');
    }

    // Calcular el total usando los productos del carrito
    const totalProductos = carrito.productos.reduce(
      (sum, item) => sum + item.cantidad * parseFloat(item.precio_unitario),
      0
    );

    const costoEnvio = metodoEnvio?.costo ? parseFloat(metodoEnvio.costo) : 0;
    const total = totalProductos + costoEnvio;

    // Crear el pedido usando el total ya calculado
    const pedido = await pedidosData.createPedido(
      usuarioId,
      direccionEnvio,
      metodoPagoId,
      metodoEnvioId,
      carrito.productos,
      total // Pasar el total calculado
    );

    const pedidoId = pedido.id;

    // Registrar el pago
    await this.registrarPago(pedido.id, metodoPagoId, {
      ...detallesPago,
      monto: total,
    });

    // Reducir el stock
    await this.reducirStock(carrito.productos);

    // Vaciar el carrito
    const carritoLimpio = await carritoData.clearCarrito(carrito.id);
    if (!carritoLimpio || carritoLimpio.count === 0) {
      throw new Error('Hubo un problema al vaciar el carrito. Intenta nuevamente.');
    }

    // Preparar el mensaje de correo
    try {
      const pedido = await pedidosData.getPedidoById(pedidoId, usuarioId); // Usamos la consulta mejorada
    
      if (!pedido) {
        throw new Error(`No se pudo encontrar el pedido con ID ${pedidoId}`);
      }
    
      const mensajeCorreo = `
        <h1>Gracias por tu pedido</h1>
        <p>Hola ${pedido.usuario.nombre},</p>
        <p>Hemos recibido tu pedido con éxito. Aquí están los detalles:</p>
        <ul>
          ${pedido.productos
            .map(
              (item) => `
            <li>${item.producto.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio_unitario.toFixed(2)}</li>
          `
            )
            .join('')}
        </ul>
        <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
        <p><strong>Dirección de envío:</strong> ${pedido.direccionEnvio}</p>
        <p><strong>Método de Envío:</strong> ${pedido.metodoEnvio.nombre} - Costo: $${pedido.metodoEnvio.costo.toFixed(2)}</p>
        <p>Gracias por confiar en nosotros.</p>
        <p>El equipo de Tu Tienda</p>
      `;
    
      await enviarCorreo(pedido.usuario.correo, 'Confirmación de tu pedido', mensajeCorreo);
      console.log(`Correo de confirmación enviado a ${pedido.usuario.correo}`);
    } catch (error) {
      console.error('Error al enviar el correo de confirmación de pedido:', error.message);
    }    

    const mensajeCostoEnvio = `El costo del método de envío seleccionado es de $${costoEnvio.toFixed(2)}.`;

    return {
      mensaje: 'Pedido y pago registrados con éxito. Carrito vaciado.',
      mensajeCostoEnvio,
      pedido: {
        ...pedido,
        total: total.toFixed(2),
      },
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

    return await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { estadoId: nuevoEstadoId },
    });
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


