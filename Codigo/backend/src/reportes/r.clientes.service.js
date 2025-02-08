import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export const clientesService = {
  // 🔹 Total de clientes registrados
  async totalClientes() {
    return await prisma.usuarios.count();
  },

  // 🔹 Clientes con más compras (devuelve nombre, apellido y cantidad de pedidos)
  async clientesConMasCompras() {
    return await prisma.pedidos.groupBy({
      by: ['usuarioId'],
      _count: { id: true }, // Corrección aquí: Se cuenta por "id" en lugar de "_all"
      orderBy: { _count: { id: 'desc' } }, // Ordenamos por la cantidad de compras
      take: 10, // Opcional: Limitar a los 10 clientes con más compras
    });
  },  

  // 🔹 Cantidad de clientes por ciudad
  async clientesPorCiudad() {
    return await prisma.usuarios.groupBy({
      by: ['ciudad'],
      _count: { id: true }, // Corrección: contar por ID de usuario
      orderBy: { _count: { id: 'desc' } },
    });
  },  

  // 🔹 Nuevos clientes por mes/año
  async clientesNuevosPorFecha(agrupacion = 'month') {
    const clientes = await prisma.usuarios.findMany({
      select: {
        fechaRegistro: true,
      },
    });

    const conteo = clientes.reduce((acc, cliente) => {
      const fecha = format(new Date(cliente.fechaRegistro), agrupacion === 'year' ? 'yyyy' : 'yyyy-MM'); // Año o Mes-Año
      acc[fecha] = (acc[fecha] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(conteo).map(([fecha, cantidad]) => ({ fecha, cantidad }));
  },

};
