import request from "supertest";
import express from "express";
import devolveSolicitacaoRouter from "../../../src/Routes/Solicitacao/devolveSolicitacao";

jest.mock("../../../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    chamado: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    alteracao: {
      create: jest.fn(),
    },
  },
}));

import prisma from "../../../src/lib/prisma";

const app = express();
app.use(express.json());
app.use(devolveSolicitacaoRouter);

describe("PUT /devolveSolicitacao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    solicitacaoId: 1,
    justificativa: "Justificativa válida com mais de 10 caracteres",
  };

  it("deve devolver a solicitação com sucesso", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.chamado.update as jest.Mock).mockResolvedValue({});
    (prisma.alteracao.create as jest.Mock).mockResolvedValue({});

    const res = await request(app).put("/devolveSolicitacao").send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Solicitação devolvida com sucesso" });

    expect(prisma.chamado.findUnique).toHaveBeenCalledWith({
      where: { id: validPayload.solicitacaoId },
    });

    expect(prisma.chamado.update).toHaveBeenCalledWith({
      where: { id: validPayload.solicitacaoId },
      data: { status: "RASCUNHO" },
    });

    expect(prisma.alteracao.create).toHaveBeenCalledWith({
      data: {
        chamadoId: validPayload.solicitacaoId,
        justificativa: validPayload.justificativa,
        status: "RASCUNHO",
      },
    });
  });

  it("deve retornar 404 se a solicitação não for encontrada", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).put("/devolveSolicitacao").send(validPayload);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Solicitação não encontrada" });
  });

  it("deve retornar 400 se os dados forem inválidos (ex: justificativa curta)", async () => {
    const res = await request(app).put("/devolveSolicitacao").send({
      solicitacaoId: 1,
      justificativa: "curta",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(prisma.chamado.findUnique).not.toHaveBeenCalled();
  });

  it("deve retornar 500 em caso de erro inesperado", async () => {
    (prisma.chamado.findUnique as jest.Mock).mockRejectedValue(new Error("Erro simulado"));

    const res = await request(app).put("/devolveSolicitacao").send(validPayload);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro interno do servidor" });
  });
});

