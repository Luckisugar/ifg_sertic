import request from "supertest";
import express from "express";
import buscaSolicitacaoPaiPorIdUsuarioResponsavelRouter from "../../Routes/Solicitacao/buscaSolicitacaoPaiPorIdUsuarioResponsavel";

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

const app = express();
app.use(express.json());
app.use(buscaSolicitacaoPaiPorIdUsuarioResponsavelRouter);

describe("GET /buscaSolicitacaoPaiPorIdUsuarioResponsavel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar uma lista paginada de chamados para um responsável", async () => {
    const mockChamados = [
      {
        id: 1,
        descricao: "Chamado A",
        assunto: "TI",
        status: "ABERTO",
        dataSolicitacao: "2025-06-10T12:00:00Z",
        solicitante: { id: 10, nome: "Ana" },
        responsavel: { id: 20, nome: "Carlos" },
        equipamento: { id: 30, nome: "Impressora" },
        tipoSolicitacao: { id: 40, nome: "Manutenção" },
        local: { id: 50, nome: "Almoxarifado" },
        alteracoes: [],
        chamadosFilhos: [],
      },
    ];

    (mockPrisma.chamado.findMany as jest.Mock).mockResolvedValue(mockChamados);
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioResponsavel?page=1&responsavelId=20");

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
      take: 2,
      orderBy: { dataSolicitacao: "desc" },
      where: {
        chamadoPaiId: null,
        responsavelId: 20,
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
        responsavelId: 20,
        status: {
          not: "RASCUNHO",
        },
      },
    });
  });

  it("deve retornar erro 400 se responsavelId não for informado", async () => {
    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioResponsavel?page=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "O parâmetro 'responsavelId' é obrigatório.",
    });

    expect(mockPrisma.chamado.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.chamado.count).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 se ocorrer falha conhecida no servidor", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue(new Error("Erro interno"));
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(0);

    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioResponsavel?responsavelId=20");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Erro interno",
    });
  });

  it("deve retornar erro genérico se o erro for desconhecido", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue("erro inesperado");

    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioResponsavel?responsavelId=20");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido. Contate o administrador.",
    });
  });
});
