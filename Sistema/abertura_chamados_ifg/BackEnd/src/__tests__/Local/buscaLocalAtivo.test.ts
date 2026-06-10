import request from "supertest";
import express from "express";
import buscaLocAtivoRouter from "../../Routes/Local/buscaLocalAtivo";

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

// App express de teste
const app = express();
app.use(express.json());
app.use(buscaLocAtivoRouter);

describe("GET /buscaLocalAtivo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todos os locais ativos", async () => {
    const locaisMockados = [
      { id: 1, nome: "Auditório", st_ativo: true },
      { id: 2, nome: "Biblioteca", st_ativo: true },
    ];

    (mockPrisma.local.findMany as jest.Mock).mockResolvedValue(locaisMockados);

    const res = await request(app).get("/buscaLocalAtivo");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ localExistente: locaisMockados });
    expect(mockPrisma.local.findMany).toHaveBeenCalledWith({
      where: { st_ativo: true },
    });
  });

  it("deve retornar erro 400 em caso de exceção", async () => {
    (mockPrisma.local.findMany as jest.Mock).mockRejectedValue(
      new Error("Falha no banco")
    );

    const res = await request(app).get("/buscaLocalAtivo");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Falha no banco" });
  });

  it("deve retornar erro genérico se erro for desconhecido", async () => {
    // Simula erro desconhecido (não instanceof Error)
    (mockPrisma.local.findMany as jest.Mock).mockImplementation(() => {
      throw "erro bruto";
    });

    const res = await request(app).get("/buscaLocalAtivo");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
