/*
  Warnings:

  - You are about to drop the `devolucion_productos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "devolucion_productos" DROP CONSTRAINT "devolucion_productos_devolucionId_fkey";

-- DropForeignKey
ALTER TABLE "devolucion_productos" DROP CONSTRAINT "devolucion_productos_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "devolucion_productos" DROP CONSTRAINT "devolucion_productos_productoId_fkey";

-- AlterTable
ALTER TABLE "devoluciones" ADD COLUMN     "cantidad" INTEGER,
ADD COLUMN     "productoId" INTEGER;

-- DropTable
DROP TABLE "devolucion_productos";

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
