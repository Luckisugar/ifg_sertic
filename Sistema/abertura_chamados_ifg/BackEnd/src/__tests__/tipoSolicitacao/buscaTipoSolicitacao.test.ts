import request from "supertest";
import express from "express";
import buscaTipoSolRouter from "../../Routes/tipoSolicitacao/buscaTipoSolicitacao";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    tipoSolicitacao: {
      findMany: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

// App Express temporário
const app = express();
app.use(express.json());
app.use(buscaTipoSolRouter);

describe("GET /buscaTipoSolicitacoes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todos os tipos de solicitação", async () => {
    // Simula retorno do banco
    (mockPrisma.tipoSolicitacao.findMany as jest.Mock).mockResolvedValue([
      { id: 1, nome: "Manutenção", st_ativo: true },
      { id: 2, nome: "Reunião", st_ativo: false },
    ]);

    const res = await request(app).get("/buscaTipoSolicitacoes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      tipoExistente: [
        { id: 1, nome: "Manutenção", st_ativo: true },
        { id: 2, nome: "Reunião", st_ativo: false },
      ],
    });
    expect(mockPrisma.tipoSolicitacao.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.tipoSolicitacao.findMany).toHaveBeenCalledWith({});
  });

  it("deve retornar erro 400 se ocorrer falha no servidor", async () => {
    (mockPrisma.tipoSolicitacao.findMany as jest.Mock).mockRejectedValue(
      new Error("Falha ao buscar tipos de solicitação")
    );

    const res = await request(app).get("/buscaTipoSolicitacoes");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Falha ao buscar tipos de solicitação" });
  });

  it("deve retornar erro 400 se erro desconhecido for lançado", async () => {
    (mockPrisma.tipoSolicitacao.findMany as jest.Mock).mockRejectedValue("erro desconhecido");

    const res = await request(app).get("/buscaTipoSolicitacoes");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
