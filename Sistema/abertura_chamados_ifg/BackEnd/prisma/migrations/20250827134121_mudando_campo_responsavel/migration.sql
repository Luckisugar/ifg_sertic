/*
  Warnings:

  - You are about to drop the column `responsavelId` on the `Alteracao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alteracao" DROP CONSTRAINT "Alteracao_responsavelId_fkey";

-- AlterTable
ALTER TABLE "Alteracao" DROP COLUMN "responsavelId",
ADD COLUMN     "responsavel" TEXT;
