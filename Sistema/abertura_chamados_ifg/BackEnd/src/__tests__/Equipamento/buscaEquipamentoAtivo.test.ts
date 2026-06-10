import request from "supertest";
import express from "express";
import buscaEquipAtivoRouter from "../../Routes/Equipamento/buscaEquipamentoAtivo";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    equipamento: {
      findMany: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

// Cria o app de teste
const app = express();
app.use(express.json());
app.use(buscaEquipAtivoRouter);

describe("GET /buscaEquipamentosAtivo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar a lista de equipamentos ativos", async () => {
    const equipamentosAtivos = [
      { id: 1, nome: "Impressora HP", st_ativo: true },
      { id: 2, nome: "Notebook Dell", st_ativo: true },
    ];

    (mockPrisma.equipamento.findMany as jest.Mock).mockResolvedValue(equipamentosAtivos);

    const res = await request(app).get("/buscaEquipamentosAtivo");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      equipamentoExistente: equipamentosAtivos,
    });

    expect(mockPrisma.equipamento.findMany).toHaveBeenCalledWith({
      where: { st_ativo: true },
    });
  });

  it("deve retornar erro 400 se ocorrer um erro desconhecido", async () => {
    (mockPrisma.equipamento.findMany as jest.Mock).mockRejectedValue(
      new Error("Erro no banco")
    );

    const res = await request(app).get("/buscaEquipamentosAtivo");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro no banco" });
  });

  it("deve retornar erro genérico se o erro não for uma instância de Error", async () => {
    // Simula erro que não é Error
    (mockPrisma.equipamento.findMany as jest.Mock).mockRejectedValue("Erro estranho");

    const res = await request(app).get("/buscaEquipamentosAtivo");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
