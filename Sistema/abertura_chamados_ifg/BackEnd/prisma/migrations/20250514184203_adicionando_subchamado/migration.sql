-- AlterTable
ALTER TABLE "Chamado" ADD COLUMN     "subChamado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "TipoSolicitacao" ADD COLUMN     "subChamado" BOOLEAN NOT NULL DEFAULT false;
