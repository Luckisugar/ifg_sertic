-- DropForeignKey
ALTER TABLE "Alteracao" DROP CONSTRAINT "Alteracao_responsavelId_fkey";

-- AlterTable
ALTER TABLE "Alteracao" ALTER COLUMN "responsavelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Alteracao" ADD CONSTRAINT "Alteracao_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
