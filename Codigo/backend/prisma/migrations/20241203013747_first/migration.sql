-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "stock" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "promocionId" INTEGER,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descuento" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3),
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "direccionEnvio" TEXT NOT NULL,
    "metodoPagoId" INTEGER NOT NULL,
    "metodoEnvioId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "fechaPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3),

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaDevolucion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaResolucion" TIMESTAMP(3),

    CONSTRAINT "devoluciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_productos" (
    "id" SERIAL NOT NULL,
    "carritoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL DEFAULT 0.0,

    CONSTRAINT "carrito_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodo_pago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "metodo_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodo_envio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "costo" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "tiempoEstimado" TEXT NOT NULL,

    CONSTRAINT "metodo_envio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "promociones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "metodo_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_metodoEnvioId_fkey" FOREIGN KEY ("metodoEnvioId") REFERENCES "metodo_envio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_productos" ADD CONSTRAINT "carrito_productos_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "carrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_productos" ADD CONSTRAINT "carrito_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
