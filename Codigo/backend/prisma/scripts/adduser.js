import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addUser() {
  try {
    // Cifra la contraseña
    const hashedPassword = await bcrypt.hash('contraseña_segura', 10);

    // Inserta un usuario en la base de datos
    const usuario = await prisma.usuarios.create({
      data: {
        nombre: 'Nuevo',
        apellido: 'Usuario',
        correo: 'nuevo@correo.com',
        password: hashedPassword, // Contraseña cifrada
        direccion: 'Av. Siempre Viva 742',
        telefono: '987654321',
        pais: 'País Prueba',
        fechaNacimiento: new Date('1995-05-15'),
      },
    });

    console.log('Usuario creado:', usuario);
  } catch (error) {
    console.error('Error al insertar usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
