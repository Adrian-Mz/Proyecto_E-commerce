-- CreateTable
CREATE TABLE "devolucion_productos" (
    "id" SERIAL NOT NULL,
    "devolucionId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaDevolucion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devolucion_productos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devolucion_productos_devolucionId_productoId_key" ON "devolucion_productos"("devolucionId", "productoId");

-- AddForeignKey
ALTER TABLE "devolucion_productos" ADD CONSTRAINT "devolucion_productos_devolucionId_fkey" FOREIGN KEY ("devolucionId") REFERENCES "devoluciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion_productos" ADD CONSTRAINT "devolucion_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
