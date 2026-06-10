/*
  Warnings:

  - Added the required column `tipoMime` to the `ImagemTeste` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImagemTeste" ADD COLUMN     "tipoMime" TEXT NOT NULL;
