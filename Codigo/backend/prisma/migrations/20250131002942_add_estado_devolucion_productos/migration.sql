-- AlterTable
ALTER TABLE "devolucion_productos" ALTER COLUMN "estadoId" SET DEFAULT 9;

-- AddForeignKey
ALTER TABLE "devolucion_productos" ADD CONSTRAINT "devolucion_productos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
