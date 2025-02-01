-- CreateTable
CREATE TABLE "historial_estado_pedidos" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaCambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estado_pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "historial_estado_pedidos_pedidoId_estadoId_fechaCambio_key" ON "historial_estado_pedidos"("pedidoId", "estadoId", "fechaCambio");

-- AddForeignKey
ALTER TABLE "historial_estado_pedidos" ADD CONSTRAINT "historial_estado_pedidos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estado_pedidos" ADD CONSTRAINT "historial_estado_pedidos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
