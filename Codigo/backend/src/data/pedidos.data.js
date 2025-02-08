import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pedidosData = {
  async getAllPedidos() {
    return prisma.pedidos.findMany({
      include: {
        productos: {
          include: { producto: true },
        },
        metodoPago: true,
        metodoEnvio: true,
        estado: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
          },
        },
        historialEstados: {
          include: {
            estado: {
              select: {
                nombre: true,
                descripcion: true,
              },
            },
          },
          orderBy: { fechaCambio: 'asc' },
        },
      },

      orderBy: {
        fechaPedido: 'desc' // Ordena por fecha de creación, de más reciente a más antiguo
      }
    });
  },

  async getPedidosByUsuarioId(usuarioId) {
    return prisma.pedidos.findMany({
      where: { usuarioId },
      include: {
        productos: {
          include: { producto: true },
        },
        metodoPago: true,
        metodoEnvio: true,
        estado: true,
        historialEstados: {
          include: {
            estado: {
              select: {
                nombre: true,
                descripcion: true,
              },
            },
          },
          orderBy: { fechaCambio: 'asc' },
        },
      },
      orderBy: {
        fechaPedido: 'desc' // Ordena por fecha de creación, de más reciente a más antiguo
      }
    });
  },

  async getPedidoById(pedidoId, usuarioId) {
    return prisma.pedidos.findFirst({
      where: { id: pedidoId, usuarioId },
      include: {
        productos: {
          include: {
            producto: {
              select: {
                nombre: true,
                precio: true,
              },
            },
          },
        },
        usuario: {
          select: {
            nombre: true,
            correo: true,
          },
        },
        metodoEnvio: {
          select: {
            nombre: true,
            costo: true,
          },
        },
        historialEstados: {
          include: {
            estado: {
              select: {
                nombre: true,
                descripcion: true,
              },
            },
          },
          orderBy: { fechaCambio: 'asc' },
        },
      },
    });
  },

  async getPedidosEntregados(usuarioId) {
    return await prisma.pedidos.findMany({
        where: {
            usuarioId,
            estadoId: 4 // Solo pedidos "Entregados"
        },
        include: {
            productos: {
                include: {
                    producto: true
                }
            }
        }
    });
  },

  async createPedido(usuarioId, direccionEnvio, metodoPagoId, metodoEnvioId, productos, total) {
    return prisma.pedidos.create({
      data: {
        usuario: { connect: { id: usuarioId } },
        metodoPago: { connect: { id: metodoPagoId } },
        metodoEnvio: { connect: { id: metodoEnvioId } },
        direccionEnvio,
        estado: { connect: { id: 1 } }, // Estado inicial: "Pendiente"
        total, // Usar el total recibido como parámetro
        fechaActualizacion: new Date(),
        productos: {
          create: productos.map(({ productoId, cantidad, precio_unitario }) => ({
            producto: { connect: { id: productoId } },
            cantidad,
            precio_unitario,
          })),
        },
        historialEstados: {
          create: {
            estadoId: 1, // Estado inicial "Pendiente"
            fechaCambio: new Date(),
          },
        },
      },
      include: {
        productos: true,
      },
    });
  },

    

  async getMetodosPago() {
    return prisma.metodo_pago.findMany();
  },

  async getMetodosEnvio() {
    return prisma.metodo_envio.findMany();
  },

  // Actualizar estado del 
  async actualizarEstadoPedido(pedidoId, nuevoEstadoId) {
    return prisma.$transaction([
      // Actualizar estado del pedido
      prisma.pedidos.update({
        where: { id: pedidoId },
        data: { estadoId: nuevoEstadoId, fechaActualizacion: new Date() },
      }),

      // Registrar el cambio en historial_estado_pedidos
      prisma.historial_estado_pedidos.create({
        data: {
          pedidoId,
          estadoId: nuevoEstadoId,
          fechaCambio: new Date(),
        },
      }),
    ]);
  },

  // Verificar si un pedido está en estado "Entregado"
  async verificarEstadoEntregado(pedidoId) {
    const pedido = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
      select: { estadoId: true },
    });

    if (!pedido) {
      throw new Error(`No se encontró un pedido con ID ${pedidoId}.`);
    }

    return pedido.estadoId === 4; // Estado "Entregado"
  },

  async getPedidosByProductoId(productoId) {
    return prisma.pedidos.findMany({
      where: {
        productos: {
          some: { productoId }, // Busca pedidos que contengan el producto con el ID especificado
        },
      },
      include: {
        productos: true, // Incluye información de los productos relacionados
      },
    });
  },

  // Historial de cambios de estado/pedidos
  async getHistorialEstadosPedido(pedidoId) {
    return prisma.historial_estado_pedidos.findMany({
      where: { pedidoId },
      include: {
        estado: {
          select: {
            nombre: true,
            descripcion: true,
          },
        },
      },
      orderBy: { fechaCambio: 'asc' },
    });
  },  

};
