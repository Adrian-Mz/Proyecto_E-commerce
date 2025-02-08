/*
  Warnings:

  - You are about to drop the column `categoriaid` on the `categoria_iva` table. All the data in the column will be lost.
  - You are about to drop the column `ivaporcentaje` on the `categoria_iva` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoriaId]` on the table `categoria_iva` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoriaId` to the `categoria_iva` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categoria_iva" DROP CONSTRAINT "categoria_iva_categoriaid_fkey";

-- DropIndex
DROP INDEX "categoria_iva_categoriaid_key";

-- AlterTable
ALTER TABLE "categoria_iva" DROP COLUMN "categoriaid",
DROP COLUMN "ivaporcentaje",
ADD COLUMN     "categoriaId" INTEGER NOT NULL,
ADD COLUMN     "ivaPorcentaje" DECIMAL DEFAULT 15.0;

-- AlterTable
ALTER TABLE "devoluciones" ADD COLUMN     "montoReembolsado" DECIMAL(65,30) DEFAULT 0.0;

-- CreateIndex
CREATE UNIQUE INDEX "categoria_iva_categoriaId_key" ON "categoria_iva"("categoriaId");

-- AddForeignKey
ALTER TABLE "categoria_iva" ADD CONSTRAINT "categoria_iva_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
