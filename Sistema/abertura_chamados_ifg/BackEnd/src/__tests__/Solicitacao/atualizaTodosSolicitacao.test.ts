import request from 'supertest';
import express from 'express';
import atualizaTodosSolicitacao from '../../Routes/Solicitacao/atualizaTodosSolicitacao';

jest.mock("../../lib/prisma", () => ({
  chamado: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

import prisma from '../../lib/prisma';

const app = express();
app.use(express.json());
app.use(atualizaTodosSolicitacao);

describe("PUT /atualizaTodosSolicitacao", () => {
  const url = "/atualizaTodosSolicitacao";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar a solicitação com sucesso", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.chamado.update as jest.Mock).mockResolvedValue({ id: 1 });

    const payload = {
      solicitacaoId: 1,
      equipamentoId: 2,
      tipoSolicitacaoId: 3,
      localId: 4,
      descricao: "Descrição válida da solicitação",
      observacao: "Observação teste",
      assunto: "Assunto válido",
      cafe: true,
      dataHora: new Date().toISOString(),
      quantidadeCadeiras: 10
    };

    const response = await request(app).put(url).send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Solicitação alterada com sucesso",
    });
  });

  it("deve retornar 400 se a validação do Zod falhar", async () => {
    const response = await request(app).put(url).send({
      solicitacaoId: 1,
      descricao: "curta", // descrição muito curta (menos de 10 caracteres)
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve retornar 404 se a solicitação não for encontrada", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).put(url).send({
      solicitacaoId: 999,
      descricao: "Descrição válida com mais de 10 caracteres",
      assunto: "Assunto válido",
      equipamentoId: null,
      tipoSolicitacaoId: null,
      localId: null,
      observacao: null,
      cafe: null,
      dataHora: null,
      quantidadeCadeiras: null
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Solicitação não encontrada",
    });
  });

  it("deve retornar 500 em caso de erro inesperado", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockRejectedValue(new Error("Erro simulado"));

    const response = await request(app).put(url).send({
      solicitacaoId: 1,
      descricao: "Descrição válida com mais de 10 caracteres",
      assunto: "Assunto válido",
      equipamentoId: null,
      tipoSolicitacaoId: null,
      localId: null,
      observacao: null,
      cafe: null,
      dataHora: null,
      quantidadeCadeiras: null
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Erro interno do servidor",
    });
  });
});
