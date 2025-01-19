/*
  Warnings:

  - You are about to drop the `categorias_promociones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productos_promociones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categorias_promociones" DROP CONSTRAINT "categorias_promociones_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "categorias_promociones" DROP CONSTRAINT "categorias_promociones_promocionId_fkey";

-- DropForeignKey
ALTER TABLE "productos_promociones" DROP CONSTRAINT "productos_promociones_productoId_fkey";

-- DropForeignKey
ALTER TABLE "productos_promociones" DROP CONSTRAINT "productos_promociones_promocionId_fkey";

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "promocionId" INTEGER;

-- AlterTable
ALTER TABLE "promociones" ADD COLUMN     "categoriaId" INTEGER;

-- DropTable
DROP TABLE "categorias_promociones";

-- DropTable
DROP TABLE "productos_promociones";

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "promociones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
