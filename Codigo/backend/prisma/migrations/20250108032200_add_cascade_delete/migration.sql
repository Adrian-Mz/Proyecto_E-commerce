-- DropForeignKey
ALTER TABLE "devoluciones" DROP CONSTRAINT "devoluciones_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "pedido_productos" DROP CONSTRAINT "pedido_productos_pedidoId_fkey";

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_productos" ADD CONSTRAINT "pedido_productos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
