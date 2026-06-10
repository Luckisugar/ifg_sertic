import request from "supertest";
import express from "express";
import buscaSolicitacaoPaiPorIdUsuarioSolicitanteRouter from "../../../src/Routes/Solicitacao/buscaSolicitacaoPaiPorIdUsuarioSolicitante";

jest.mock("../../../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    chamado: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import mockPrisma from "../../../src/lib/prisma";

const app = express();
app.use(express.json());
app.use(buscaSolicitacaoPaiPorIdUsuarioSolicitanteRouter);

describe("GET /buscaSolicitacaoPaiPorIdUsuarioSolicitante", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar uma lista paginada de chamados do solicitante", async () => {
    const mockChamados = [
      {
        id: 1,
        descricao: "Chamado exemplo",
        assunto: "Manutenção",
        status: "ABERTO",
        dataSolicitacao: "2025-06-10T10:00:00Z",
        solicitante: { id: 1, nome: "Maria" },
        responsavel: { id: 2, nome: "João" },
        equipamento: { id: 3, nome: "Impressora" },
        tipoSolicitacao: { id: 4, nome: "TI" },
        local: { id: 5, nome: "Sala 1" },
        alteracoes: [],
        chamadosFilhos: [],
      },
    ];

    (mockPrisma.chamado.findMany as jest.Mock).mockResolvedValue(mockChamados);
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioSolicitante?page=1&solicitanteId=1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      chamados: mockChamados,
      totalChamados: 1,
      pagina: 1,
      totalPaginas: 1,
    });

    expect(mockPrisma.chamado.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 2,
      orderBy: { dataSolicitacao: "desc" },
      where: {
        chamadoPaiId: null,
        solicitanteId: 1,
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
        solicitanteId: 1,
      },
    });
  });

  it("deve retornar erro 400 se solicitanteId não for informado", async () => {
    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioSolicitante?page=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "O parâmetro 'solicitanteId' é obrigatório.",
    });

    expect(mockPrisma.chamado.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.chamado.count).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 se o prisma lançar um erro conhecido", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue(new Error("Erro simulado"));
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(0);

    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioSolicitante?solicitanteId=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro simulado" });
  });

  it("deve retornar erro genérico caso o erro não seja uma instância de Error", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue("Erro desconhecido");

    const res = await request(app).get("/buscaSolicitacaoPaiPorIdUsuarioSolicitante?solicitanteId=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido. Contate o administrador.",
    });
  });
});
