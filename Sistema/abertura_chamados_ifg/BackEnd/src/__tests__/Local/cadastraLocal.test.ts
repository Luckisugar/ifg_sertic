import request from "supertest";
import express from "express";
import cadastraLocRouter from "../../Routes/Local/cadastraLocal";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    local: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma"; //Aqui eu to importanto o mock que fiz logo acima

// App Express temporário
const app = express();
app.use(express.json());
app.use(cadastraLocRouter);

describe("POST /cadastraLocal", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve cadastrar um novo local com sucesso", async () => {
    (mockPrisma.local.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.local.create as jest.Mock).mockResolvedValue({
      id: "1",
      nome: "Sala S301",
      st_ativo: true,
    });

    const res = await request(app).post("/cadastraLocal").send({
      nome: "Sala S301",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Local cadastrado com sucesso",
      id: "1",
      nome: "Sala S301",
      status: true,
    });
  });

  it("deve retornar erro se o local já estiver ativo", async () => {
    (mockPrisma.local.findFirst as jest.Mock).mockResolvedValue({
      id: "2",
      nome: "Sala Existente",
      st_ativo: true,
    });

    const res = await request(app).post("/cadastraLocal").send({
      nome: "Sala Existente",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Local já cadastrado" });
  });

  it("deve reativar um local inativo", async () => {
    (mockPrisma.local.findFirst as jest.Mock).mockResolvedValue({
      id: "3",
      nome: "Sala Inativa",
      st_ativo: false,
    });

    (mockPrisma.local.update as jest.Mock).mockResolvedValue({
      id: "3",
      nome: "Sala Inativa",
      st_ativo: true,
    });

    const res = await request(app).post("/cadastraLocal").send({
      nome: "Sala Inativa",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Local cadastrado com sucesso",
      id: "3",
      nome: "Sala Inativa",
      status: true,
    });
  });

  it("deve retornar erro de validação se nome estiver ausente ou inválido", async () => {
    const res = await request(app).post("/cadastraLocal").send({
      nome: "", // inválido
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar erro interno se ocorrer falha inesperada", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  (mockPrisma.local.findFirst as jest.Mock).mockRejectedValue(new Error("Erro inesperado"));

  const res = await request(app).post("/cadastraLocal").send({
    nome: "Qualquer",
  });

  expect(res.status).toBe(500);
  expect(res.body).toEqual({ error: "Erro interno do servidor" });
  expect(consoleSpy).toHaveBeenCalledWith("Erro ao cadastrar local:", expect.any(Error));

  consoleSpy.mockRestore();
  });
});
