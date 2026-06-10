import request from 'supertest';
import express from 'express';
import atualizaSolicitacaoRouter from '../../Routes/Solicitacao/atualizaSolicitacaoAdm';

jest.mock("../../lib/prisma", () => {
  return {
    chamado: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
});

import prisma from '../../lib/prisma';

const app = express();
app.use(express.json());
app.use(atualizaSolicitacaoRouter);

describe("PUT /atualizaSolicitacaoAdm", () => {
  const url = "/atualizaSolicitacaoAdm";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar um chamado com sucesso", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue({ id: 10 });
    (prisma.chamado.update as jest.Mock).mockResolvedValue({ id: 10, status: "EM EXECUÇÃO" });

    const response = await request(app).put(url).send({
      chamadoId: 10,
      responsavelId: 4,
      dataPrevista: "2025-05-02T18:00:00.000Z",
      prioridade: "Alta",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Chamado atualizado com sucesso");
    expect(response.body).toHaveProperty("chamadoAtualizado");
  });

  it("deve retornar erro 400 para dados inválidos (ex: campo vazio)", async () => {
    const response = await request(app).put(url).send({
      chamadoId: 10,
      responsavelId: 4,
      dataPrevista: "", // inválido
      prioridade: "Alta",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve retornar erro 404 se o chamado não for encontrado", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).put(url).send({
      chamadoId: 999,
      responsavelId: 4,
      dataPrevista: "2025-05-02T18:00:00.000Z",
      prioridade: "Alta",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Chamado não encontrado" });
  });

  it("deve retornar erro 500 em caso de exceção interna", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockRejectedValue(new Error("Erro simulado"));

    const response = await request(app).put(url).send({
      chamadoId: 10,
      responsavelId: 4,
      dataPrevista: "2025-05-02T18:00:00.000Z",
      prioridade: "Alta",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erro interno do servidor" });
  });
});
