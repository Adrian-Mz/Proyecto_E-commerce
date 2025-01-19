/*
  Warnings:

  - You are about to drop the column `promocionId` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `promociones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_promocionId_fkey";

-- DropForeignKey
ALTER TABLE "promociones" DROP CONSTRAINT "promociones_categoriaId_fkey";

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "promocionId";

-- AlterTable
ALTER TABLE "promociones" DROP COLUMN "categoriaId";

-- CreateTable
CREATE TABLE "productos_promociones" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "promocionId" INTEGER NOT NULL,

    CONSTRAINT "productos_promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_promociones" (
    "id" SERIAL NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "promocionId" INTEGER NOT NULL,

    CONSTRAINT "categorias_promociones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productos_promociones_productoId_promocionId_key" ON "productos_promociones"("productoId", "promocionId");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_promociones_categoriaId_promocionId_key" ON "categorias_promociones"("categoriaId", "promocionId");

-- AddForeignKey
ALTER TABLE "productos_promociones" ADD CONSTRAINT "productos_promociones_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_promociones" ADD CONSTRAINT "productos_promociones_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "promociones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_promociones" ADD CONSTRAINT "categorias_promociones_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_promociones" ADD CONSTRAINT "categorias_promociones_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "promociones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
