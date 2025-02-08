import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export const clientesService = {
  // 🔹 Total de clientes registrados con opción de filtrar por ciudad
  async totalClientes({ ciudad = null } = {}) {
    const where = ciudad ? { ciudad: { contains: ciudad, mode: "insensitive" } } : {};

    const total = await prisma.usuarios.count({ where });
    return { totalClientes: total };
  },

  // 🔹 Clientes con más compras (incluye nombre, apellido y cantidad de pedidos) con filtro opcional por ciudad
  async clientesConMasCompras({ ciudad = null, limit = 10 } = {}) {
    const where = ciudad ? { usuario: { ciudad: { contains: ciudad, mode: "insensitive" } } } : {};

    const compras = await prisma.pedidos.groupBy({
      by: ['usuarioId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: parseInt(limit, 10),
      where,
    });

    const usuariosIds = compras.map(c => c.usuarioId);
    const usuarios = await prisma.usuarios.findMany({
      where: { id: { in: usuariosIds } },
      select: { id: true, nombre: true, apellido: true, ciudad: true },
    });

    const usuariosMap = Object.fromEntries(usuarios.map(u => [u.id, u]));

    return compras.map(c => ({
      usuarioId: c.usuarioId,
      nombre: usuariosMap[c.usuarioId]?.nombre || "Desconocido",
      apellido: usuariosMap[c.usuarioId]?.apellido || "",
      ciudad: usuariosMap[c.usuarioId]?.ciudad || "No especificado",
      cantidadPedidos: c._count.id,
    }));
  },

  // 🔹 Cantidad de clientes por ciudad (ordenados de mayor a menor)
  async clientesPorCiudad() {
    const clientes = await prisma.usuarios.groupBy({
      by: ['ciudad'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return clientes.map(c => ({
      ciudad: c.ciudad || "No especificado",
      cantidadClientes: c._count.id,
    }));
  },

  // 🔹 Nuevos clientes registrados por día, mes o año con filtro de rango de fechas
  async clientesNuevosPorFecha({ agrupacion = 'month', fechaInicio = null, fechaFin = null } = {}) {
    const where = fechaInicio && fechaFin
      ? { fechaRegistro: { gte: new Date(fechaInicio), lte: new Date(fechaFin) } }
      : {};

    const clientes = await prisma.usuarios.findMany({
      select: { fechaRegistro: true },
      where,
      orderBy: { fechaRegistro: 'asc' },
    });

    const conteo = clientes.reduce((acc, cliente) => {
      let claveFecha;
      const fechaFormateada = format(new Date(cliente.fechaRegistro), 'yyyy-MM-dd');

      if (agrupacion === 'day') {
        claveFecha = fechaFormateada;
      } else if (agrupacion === 'month') {
        claveFecha = format(new Date(cliente.fechaRegistro), 'yyyy-MM');
      } else if (agrupacion === 'year') {
        claveFecha = format(new Date(cliente.fechaRegistro), 'yyyy');
      }

      acc[claveFecha] = (acc[claveFecha] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(conteo).map(([fecha, cantidad]) => ({ fecha, cantidad }));
  },
};
