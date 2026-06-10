/*
  Warnings:

  - Added the required column `responsavelId` to the `Alteracao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alteracao" ADD COLUMN     "responsavelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Alteracao" ADD CONSTRAINT "Alteracao_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
