import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ivaService = {
  // Obtener el IVA por categoría
    async obtenerIvaPorCategoria(categoriaId) {
        const categoriaIva = await prisma.categoria_iva.findUnique({
        where: { categoriaId },
        });

        return categoriaIva ? categoriaIva.ivaPorcentaje : 15.0; // 12% por defecto si no se define
    },

    // Asignar un IVA a una categoría
    async asignarIvaACategoria(categoriaId, ivaPorcentaje) {
        if (isNaN(ivaPorcentaje) || ivaPorcentaje < 0) {
            throw new Error('El IVA debe ser un número válido y positivo.');
        }

        return await prisma.categoria_iva.upsert({
            where: { categoriaId },
            update: { ivaPorcentaje },
            create: { categoriaId, ivaPorcentaje },
        });
    },

    async actualizarIvaCategoria(categoriaId, nuevoIva) {
        if (isNaN(categoriaId) || isNaN(nuevoIva)) {
            throw new Error('IDs y valores de IVA deben ser numéricos.');
        }

        const ivaPorcentaje = parseFloat(nuevoIva.toFixed(2));

        // Verificar si la categoría ya tiene un IVA asignado
        const existeIva = await prisma.categoria_iva.findUnique({
        where: { categoriaId },
        });

        if (existeIva) {
        // Si ya existe, actualizar el valor
        await prisma.categoria_iva.update({
            where: { categoriaId },
            data: { ivaPorcentaje },
        });
        } else {
        // Si no existe, crearlo
        await prisma.categoria_iva.create({
            data: {
            categoriaId,
            ivaPorcentaje,
            },
        });
        }

        // 🔹 Actualizar el IVA en todos los productos de la categoría
        const productos = await prisma.productos.findMany({
            where: { categoriaId },
            select: { id: true, precioBase: true },
        });

        await Promise.all(
            productos.map((producto) =>
                this.actualizarIvaProducto(producto.id, ivaPorcentaje, producto.precioBase)
            )
        );

        return { categoriaId, nuevoIva: ivaPorcentaje };
    },

    // 🔹 Actualizar el IVA de un producto individual
    async actualizarIvaProducto(productoId, nuevoIva, precioBase = null) {
        if (isNaN(productoId) || isNaN(nuevoIva)) {
            throw new Error('IDs y valores de IVA deben ser numéricos.');
        }

        const ivaPorcentaje = parseFloat(nuevoIva.toFixed(2));

        // Obtener el precio base si no se proporcionó
        let producto = await prisma.productos.findUnique({
        where: { id: productoId },
        select: { precioBase: true },
        });

        if (!producto) {
            throw new Error('Producto no encontrado.');
        }

        precioBase = precioBase !== null ? parseFloat(precioBase) : parseFloat(producto.precioBase);

        // Calcular el nuevo precio con IVA
        const precioConIva = parseFloat((precioBase * (1 + ivaPorcentaje / 100)).toFixed(2));

        // Actualizar el producto con el nuevo IVA
        await prisma.productos.update({
        where: { id: productoId },
        data: {
            ivaPorcentaje,
            precio: precioConIva,
        },
        });

        console.log(`✅ IVA del producto ${productoId} actualizado a ${ivaPorcentaje}% (Nuevo precio: ${precioConIva}).`);

        return { productoId, nuevoIva: ivaPorcentaje, nuevoPrecio: precioConIva };
    },
};
