-- AlterTable
ALTER TABLE "Chamado" ADD COLUMN     "cafe" BOOLEAN DEFAULT false,
ADD COLUMN     "dataHora" TIMESTAMP(3),
ADD COLUMN     "quantidadeCadeiras" INTEGER;
