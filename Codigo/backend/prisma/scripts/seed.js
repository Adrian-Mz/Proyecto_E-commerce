import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Inserta un usuario de prueba
    const usuario = await prisma.usuarios.create({
      data: {
        nombre: 'Ejemplo',
        apellido: 'Usuario',
        correo: 'ejemplo@correo.com',
        password: hashedPassword, // Contraseña cifrada
        direccion: 'Calle Falsa 123',
        telefono: '123456789',
        pais: 'País Ejemplo',
        fechaNacimiento: new Date('1990-01-01'),
      },
    });

    console.log('Usuario insertado:', usuario);
  } catch (error) {
    console.error('Error al insertar usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
