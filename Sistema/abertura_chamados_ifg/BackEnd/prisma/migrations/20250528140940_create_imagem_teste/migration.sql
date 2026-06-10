-- CreateTable
CREATE TABLE "ImagemTeste" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "imagem" BYTEA NOT NULL,

    CONSTRAINT "ImagemTeste_pkey" PRIMARY KEY ("id")
);
