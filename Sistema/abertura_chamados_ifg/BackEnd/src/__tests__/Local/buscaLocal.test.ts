import request from "supertest";
import express from "express";
import buscaLocRouter from "../../Routes/Local/buscaLocal";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    local: {
      findMany: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(buscaLocRouter);

describe("GET /buscaLocais", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todos os locais", async () => {
    const locaisMockados = [
      { id: 1, nome: "Laboratório", st_ativo: true },
      { id: 2, nome: "Sala 101", st_ativo: false },
    ];

    (mockPrisma.local.findMany as jest.Mock).mockResolvedValue(locaisMockados);

    const res = await request(app).get("/buscaLocais");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ localExistente: locaisMockados });
    expect(mockPrisma.local.findMany).toHaveBeenCalled();
  });

  it("deve retornar erro 400 se ocorrer erro no Prisma", async () => {
    (mockPrisma.local.findMany as jest.Mock).mockRejectedValue(new Error("Falha no banco"));

    const res = await request(app).get("/buscaLocais");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Falha no banco" });
    expect(mockPrisma.local.findMany).toHaveBeenCalled();
  });

  it("deve retornar erro 400 com mensagem genérica se o erro não for uma instância de Error", async () => {
    // Erro simulando algo como `throw "algo deu errado"`
    (mockPrisma.local.findMany as jest.Mock).mockRejectedValue("Erro genérico");

    const res = await request(app).get("/buscaLocais");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
    expect(mockPrisma.local.findMany).toHaveBeenCalled();
  });
});
