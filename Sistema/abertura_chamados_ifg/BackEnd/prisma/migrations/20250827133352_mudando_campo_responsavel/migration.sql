/*
  Warnings:

  - You are about to drop the column `responsavelId` on the `Chamado` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chamado" DROP CONSTRAINT "Chamado_responsavelId_fkey";

-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "responsavelId",
ADD COLUMN     "responsavel" TEXT;
