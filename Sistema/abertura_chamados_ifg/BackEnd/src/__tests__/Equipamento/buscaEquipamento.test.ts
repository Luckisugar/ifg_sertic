import request from "supertest";
import express from "express";
import buscaEquipRouter from "../../Routes/Equipamento/buscaEquipamento";

// Mock do prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    equipamento: {
      findMany: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

// App Express temporário
const app = express();
app.use(express.json());
app.use(buscaEquipRouter);

describe("GET /buscaEquipamentos", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todos os equipamentos", async () => {
    // Simula retorno de equipamentos do banco
    (mockPrisma.equipamento.findMany as jest.Mock).mockResolvedValue([
      { id: 1, nome: "Notebook Dell", st_ativo: true },
      { id: 2, nome: "Monitor Samsung", st_ativo: false },
    ]);

    const res = await request(app).get("/buscaEquipamentos");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      equipamentoExistente: [
        { id: 1, nome: "Notebook Dell", st_ativo: true },
        { id: 2, nome: "Monitor Samsung", st_ativo: false },
      ],
    });
 //Verifica se a função findMany() foi chamada exatamente uma vez durante a execução do teste
    expect(mockPrisma.equipamento.findMany).toHaveBeenCalledTimes(1);
    //Verifica se a função findMany() foi chamada com os parâmetros corretos, neste caso, um objeto vazio {}.
    expect(mockPrisma.equipamento.findMany).toHaveBeenCalledWith({});
  });

  it("deve retornar erro 400 se ocorrer falha no servidor", async () => {
    (mockPrisma.equipamento.findMany as jest.Mock).mockRejectedValue(
      new Error("Falha ao buscar equipamentos")
    );

    const res = await request(app).get("/buscaEquipamentos");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Falha ao buscar equipamentos" });
  });

  it("deve retornar erro 400 se erro desconhecido for lançado", async () => {
    (mockPrisma.equipamento.findMany as jest.Mock).mockRejectedValue("erro desconhecido");

    const res = await request(app).get("/buscaEquipamentos");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
