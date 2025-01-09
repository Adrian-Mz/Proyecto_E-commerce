import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function crearUsuarioAdministrador() {
  try {
    // Verifica si el rol de administrador existe
    let rolAdministrador = await prisma.roles.findUnique({
      where: { nombre: 'Administrador' },
    });

    // Si no existe, crea el rol
    if (!rolAdministrador) {
      rolAdministrador = await prisma.roles.create({
        data: { nombre: 'Administrador' },
      });
      console.log('Rol de Administrador creado:', rolAdministrador);
    }

    // Genera la contraseña hasheada
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Verifica si ya existe un usuario administrador
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { correo: 'admin@ecommerce.com' },
    });

    if (usuarioExistente) {
      console.log('El usuario administrador ya existe:', usuarioExistente);
      return;
    }

    // Inserta el usuario administrador
    const usuarioAdmin = await prisma.usuarios.create({
      data: {
        nombre: 'Admin',
        apellido: 'Principal',
        correo: 'admin@ecommerce.com',
        password: hashedPassword,
        direccion: 'Dirección de ejemplo',
        telefono: '123456789',
        pais: 'País de ejemplo',
        fechaNacimiento: new Date('1990-01-01'),
        rol: { connect: { id: rolAdministrador.id } }, // Conecta al rol administrador
      },
    });

    console.log('Usuario administrador creado exitosamente:', usuarioAdmin);
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearUsuarioAdministrador();
