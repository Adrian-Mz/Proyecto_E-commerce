-- AlterTable
ALTER TABLE "promociones" ADD COLUMN     "categoriaId" INTEGER;

-- AddForeignKey
ALTER TABLE "promociones" ADD CONSTRAINT "promociones_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
