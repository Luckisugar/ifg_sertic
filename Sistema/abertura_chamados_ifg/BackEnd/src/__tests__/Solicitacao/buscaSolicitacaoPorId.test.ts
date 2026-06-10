import request from "supertest";
import express from "express";
import buscaChamadoPorIdRouter from "../../Routes/Solicitacao/buscaSolicitacaoPorId";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    chamado: {
      findUnique: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(express.json());
app.use(buscaChamadoPorIdRouter);

describe("GET /buscaSolicitacaoPorId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar os dados do chamado quando o ID é válido", async () => {
    const mockChamado = {
      id: 1,
      descricao: "Teste chamado",
      assunto: "TI",
      status: "ABERTO",
      dataSolicitacao: "2025-06-10T10:00:00Z",
      solicitante: { id: 1, nome: "Maria" },
      responsavel: { id: 2, nome: "João" },
      equipamento: { id: 3, nome: "Notebook" },
      tipoSolicitacao: { id: 4, nome: "Suporte" },
      local: { id: 5, nome: "Sala 2" },
      alteracoes: [],
      chamadosFilhos: [],
    };

    (mockPrisma.chamado.findUnique as jest.Mock).mockResolvedValue(mockChamado);

    const res = await request(app).get("/buscaSolicitacaoPorId?id=1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockChamado);
    expect(mockPrisma.chamado.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
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
  });

  it("deve retornar erro 400 se o ID for inválido (não numérico)", async () => {
    const res = await request(app).get("/buscaSolicitacaoPorId?id=abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "ID inválido" });
    expect(mockPrisma.chamado.findUnique).not.toHaveBeenCalled();
  });

  it("deve retornar erro 404 se o chamado não for encontrado", async () => {
    (mockPrisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/buscaSolicitacaoPorId?id=999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Chamado não encontrado" });
  });

  it("deve retornar erro 400 se ocorrer um erro conhecido (Error)", async () => {
    (mockPrisma.chamado.findUnique as jest.Mock).mockRejectedValue(new Error("Erro simulado"));

    const res = await request(app).get("/buscaSolicitacaoPorId?id=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro simulado" });
  });

  it("deve retornar erro 400 genérico se o erro for desconhecido", async () => {
    (mockPrisma.chamado.findUnique as jest.Mock).mockRejectedValue("Erro desconhecido");

    const res = await request(app).get("/buscaSolicitacaoPorId?id=1");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
