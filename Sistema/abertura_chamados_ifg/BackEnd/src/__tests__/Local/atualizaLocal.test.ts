// src/__tests__/Local/atualizaLocal.test.ts

import request from "supertest";
import express from "express";
import atualizaLocRouter from "../../Routes/Local/atualizaLocal";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    local: {
      update: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

// App Express temporário
const app = express();
app.use(express.json());
app.use(atualizaLocRouter);

describe("PUT /atualizaLocal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar o status de um local com sucesso", async () => {
    (mockPrisma.local.update as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .put("/atualizaLocal")
      .send({ id: 1, st_ativo: false });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
    expect(mockPrisma.local.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { st_ativo: false },
    });
  });

  it("deve retornar erro 400 se id ou st_ativo estiver ausente", async () => {
    const res = await request(app)
      .put("/atualizaLocal")
      .send({ st_ativo: true }); // faltando id

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "ID e status são obrigatórios" });
    expect(mockPrisma.local.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 se st_ativo não for boolean", async () => {
    const res = await request(app)
      .put("/atualizaLocal")
      .send({ id: 1, st_ativo: "sim" }); // tipo inválido

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "ID e status são obrigatórios" });
    expect(mockPrisma.local.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro 400 com mensagem do erro se falhar no Prisma", async () => {
    const erro = new Error("Erro no banco");
    (mockPrisma.local.update as jest.Mock).mockRejectedValue(erro);

    const res = await request(app)
      .put("/atualizaLocal")
      .send({ id: 1, st_ativo: true });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro no banco" });
  });

  it("deve retornar erro genérico se erro não for uma instância de Error", async () => {
    // Simula erro não convencional
    (mockPrisma.local.update as jest.Mock).mockRejectedValue("Erro string");

    const res = await request(app)
      .put("/atualizaLocal")
      .send({ id: 1, st_ativo: true });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
