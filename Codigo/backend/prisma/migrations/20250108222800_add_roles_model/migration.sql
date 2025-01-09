-- Crear la tabla roles
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- Insertar roles iniciales
INSERT INTO "roles" ("id", "nombre") VALUES
(1, 'Administrador'),
(2, 'Cliente');

-- Añadir la columna con un valor predeterminado temporal
ALTER TABLE "usuarios" ADD COLUMN "rolId" INTEGER NOT NULL DEFAULT 1;

-- Crear índice único en el nombre de los roles
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- Añadir clave foránea después de insertar los roles
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Eliminar el valor predeterminado para `rolId`
ALTER TABLE "usuarios" ALTER COLUMN "rolId" DROP DEFAULT;
