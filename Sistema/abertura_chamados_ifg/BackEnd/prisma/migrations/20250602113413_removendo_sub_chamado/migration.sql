/*
  Warnings:

  - You are about to drop the column `subChamado` on the `Chamado` table. All the data in the column will be lost.
  - You are about to drop the column `subChamado` on the `TipoSolicitacao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chamado" DROP COLUMN "subChamado";

-- AlterTable
ALTER TABLE "TipoSolicitacao" DROP COLUMN "subChamado";
