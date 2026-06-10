/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT,
    "tipoUsuario" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "chamadoId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioChat" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chamado" (
    "id" SERIAL NOT NULL,
    "solicitanteId" INTEGER NOT NULL,
    "responsavelId" INTEGER,
    "equipamentoId" INTEGER,
    "tipoSolicitacaoId" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "chamadoPaiId" INTEGER,
    "descricao" TEXT NOT NULL,
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevistaAtual" TIMESTAMP(3),
    "dataPrevistaAnterior" TIMESTAMP(3),
    "dataPrevistaOriginal" TIMESTAMP(3),
    "prioridadeAtual" TEXT NOT NULL,
    "prioridadeAnterior" TEXT,
    "prioridadeOriginal" TEXT,
    "status" TEXT NOT NULL,
    "observacao" TEXT,
    "assunto" TEXT NOT NULL,
    "imagem" BYTEA,

    CONSTRAINT "Chamado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoSolicitacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "TipoSolicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Local" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "chamadoId" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alteracao" (
    "id" SERIAL NOT NULL,
    "chamadoId" INTEGER NOT NULL,
    "justificativa" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "dataPrevista" TIMESTAMP(3) NOT NULL,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alteracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "enviadaPorId" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "Chamado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioChat" ADD CONSTRAINT "UsuarioChat_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioChat" ADD CONSTRAINT "UsuarioChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_tipoSolicitacaoId_fkey" FOREIGN KEY ("tipoSolicitacaoId") REFERENCES "TipoSolicitacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Local"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamado" ADD CONSTRAINT "Chamado_chamadoPaiId_fkey" FOREIGN KEY ("chamadoPaiId") REFERENCES "Chamado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "Chamado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alteracao" ADD CONSTRAINT "Alteracao_chamadoId_fkey" FOREIGN KEY ("chamadoId") REFERENCES "Chamado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_enviadaPorId_fkey" FOREIGN KEY ("enviadaPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
