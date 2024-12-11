import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Inserta categorías
    const categorias = await prisma.categorias.createMany({
      data: [
        { nombre: 'Electrónica', descripcion: 'Productos electrónicos' },
        { nombre: 'Hogar', descripcion: 'Productos para el hogar' },
        { nombre: 'Moda', descripcion: 'Ropa y accesorios' },
      ],
    });

    console.log('Categorías creadas:', categorias);

    // Inserta promociones
    const promociones = await prisma.promociones.createMany({
      data: [
        { nombre: 'Descuento Verano', descripcion: '10% de descuento', descuento: 10 },
        { nombre: 'Black Friday', descripcion: '50% de descuento', descuento: 50 },
      ],
    });

    console.log('Promociones creadas:', promociones);

    // Inserta productos
    const productos = await prisma.productos.createMany({
      data: [
        {
          nombre: 'Smartphone',
          descripcion: 'Teléfono inteligente de última generación',
          precio: 699.99,
          stock: 50,
          imagen: 'smartphone.jpg',
          categoriaId: 1, // Relación con la categoría "Electrónica"
          promocionId: 1, // Relación con la promoción "Descuento Verano"
        },
        {
          nombre: 'Televisor 4K',
          descripcion: 'Televisor Ultra HD 4K de 55 pulgadas',
          precio: 999.99,
          stock: 30,
          imagen: 'tv4k.jpg',
          categoriaId: 1,
          promocionId: 2, // Relación con la promoción "Black Friday"
        },
        {
          nombre: 'Sofá',
          descripcion: 'Sofá cómodo de 3 plazas',
          precio: 399.99,
          stock: 20,
          imagen: 'sofa.jpg',
          categoriaId: 2, // Relación con la categoría "Hogar"
          promocionId: null, // Sin promoción
        },
        {
          nombre: 'Camisa',
          descripcion: 'Camisa de algodón 100%',
          precio: 29.99,
          stock: 100,
          imagen: 'camisa.jpg',
          categoriaId: 3, // Relación con la categoría "Moda"
          promocionId: null,
        },
        {
          nombre: 'Laptop',
          descripcion: 'Portátil con procesador i7 y 16GB de RAM',
          precio: 1199.99,
          stock: 25,
          imagen: 'laptop.jpg',
          categoriaId: 1,
          promocionId: 2,
        },
      ],
    });

    console.log('Productos creados:', productos);
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
