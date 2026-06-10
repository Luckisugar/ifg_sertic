import request from "supertest";
import express from "express";
import buscaSolicitacaoRouter from "../../Routes/Solicitacao/buscaSolicitacao";

// Mock do prisma
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
app.use(buscaSolicitacaoRouter);

describe("GET /buscaSolicitacao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar lista paginada de chamados com sucesso", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        descricao: "Problema no PC",
        assunto: "TI",
        status: "ABERTO",
        dataSolicitacao: new Date().toISOString(),
        solicitante: { nome: "João" },
        responsavel: { nome: "Maria" },
        equipamento: null,
        tipoSolicitacao: { nome: "Manutenção" },
        local: { nome: "Bloco A" },
        alteracoes: [],
        chamadosFilhos: [],
      },
    ]);
    (mockPrisma.chamado.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get("/buscaSolicitacao?page=1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      chamados: expect.any(Array),
      totalChamados: 1,
      pagina: 1,
      totalPaginas: 1,
    });

    expect(mockPrisma.chamado.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.chamado.count).toHaveBeenCalledTimes(1);
    //essa linha verifica se a função count foi chamada exatamente 
    // uma vez, ou seja, se o código realmente tentou contar o número total de chamados no banco.
  });

  it("deve retornar erro 400 se um erro conhecido for lançado", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue(new Error("Erro no banco"));

    const res = await request(app).get("/buscaSolicitacao?page=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro no banco" });
  });

  it("deve retornar erro 400 se erro desconhecido for lançado", async () => {
    (mockPrisma.chamado.findMany as jest.Mock).mockRejectedValue("erro desconhecido");

    const res = await request(app).get("/buscaSolicitacao?page=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
