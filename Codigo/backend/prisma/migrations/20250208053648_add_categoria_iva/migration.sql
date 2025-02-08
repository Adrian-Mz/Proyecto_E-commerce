/*
  Warnings:

  - You are about to drop the column `pais` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `ciudad` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "pais",
ADD COLUMN     "ciudad" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "categoria_iva" (
    "id" SERIAL NOT NULL,
    "categoriaid" INTEGER NOT NULL,
    "ivaporcentaje" DECIMAL DEFAULT 15.0,

    CONSTRAINT "categoria_iva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_iva_categoriaid_key" ON "categoria_iva"("categoriaid");

-- AddForeignKey
ALTER TABLE "categoria_iva" ADD CONSTRAINT "categoria_iva_categoriaid_fkey" FOREIGN KEY ("categoriaid") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
