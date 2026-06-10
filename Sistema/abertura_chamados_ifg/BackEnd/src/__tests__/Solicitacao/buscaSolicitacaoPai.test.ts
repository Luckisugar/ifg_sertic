import request from "supertest";
import express from "express";
import buscaSolicitacaoPaiRouter from "../../Routes/Solicitacao/buscaSolicitacaoPai";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    chamado: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

// App Express temporário
const app = express();
app.use(express.json());
app.use(buscaSolicitacaoPaiRouter);

describe("GET /buscaSolicitacaoPai", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar uma lista paginada de chamados pais", async () => {
    // Mock dos dados de resposta
    const mockChamados = [
      {
        id: 1,
        descricao: "Chamado 1",
        assunto: "Rede",
        status: "ABERTO",
        dataSolicitacao: "2025-06-10T10:00:00Z",
        solicitante: { id: 1, nome: "João" },
        responsavel: { id: 2, nome: "Maria" },
        equipamento: { id: 1, nome: "Notebook" },
        tipoSolicitacao: { id: 1, nome: "Reparo" },
        local: { id: 1, nome: "TI" },
        alteracoes: [],
        chamadosFilhos: [],
      },
    ];

    (mockPrisma.chamado.findMany as jest.Mock).mockResolvedValue(mockChamados);
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get("/buscaSolicitacaoPai?page=1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      chamados: mockChamados,
      totalChamados: 1,
      pagina: 1,
      totalPaginas: 1,
    });

    expect(mockPrisma.chamado.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.chamado.count).toHaveBeenCalledTimes(1);

    expect(mockPrisma.chamado.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 5,
      orderBy: { dataSolicitacao: "desc" },
      where: {
        chamadoPaiId: null,
        status: {
          not: "RASCUNHO",
        },
      },
      include: {
        solicitante: true,
        responsavel: true,
        equipamento: true,
        tipoSolicitacao: true,
        local: true,
        alteracoes: true,
        chamadosFilhos: true,
      },
    });

    expect(mockPrisma.chamado.count).toHaveBeenCalledWith({
      where: {
        chamadoPaiId: null,
        status: {
          not: "RASCUNHO",
        },
      },
    });
  });

  it("deve retornar erro 400 se ocorrer falha no servidor", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue(new Error("Erro no banco"));
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(0);

    const res = await request(app).get("/buscaSolicitacaoPai?page=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro no banco" });
  });

  it("deve retornar erro 400 para erro desconhecido", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue("erro desconhecido");

    const res = await request(app).get("/buscaSolicitacaoPai");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
