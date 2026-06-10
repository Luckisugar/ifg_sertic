import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import logoffRouter from "../../Routes/auth/logoff";

// Mocks
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    tokenBlacklist: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import prisma from "../../lib/prisma";

const app = express();
app.use(express.json());
app.use(logoffRouter);

process.env.JWT_SECRET = "segredo_de_teste";


describe("POST /logoff", () => {
  const route = "/logoff";
  const tokenPayload = { userId: 1 };
  const fakeToken = jwt.sign(tokenPayload, process.env.JWT_SECRET as string);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 401 se o token não for fornecido", async () => {
    const res = await request(app).post(route);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Token não fornecido." });
  });

  it("deve retornar 400 se o token for inválido", async () => {
    const res = await request(app)
      .post(route)
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 se o token já estiver na blacklist", async () => {
    (prisma.tokenBlacklist.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const res = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Token já está inválido (usuário já deslogado)." });
  });

  it("deve retornar 200 e remover tokens expirados se logoff for bem-sucedido", async () => {
    (prisma.tokenBlacklist.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.tokenBlacklist.create as jest.Mock).mockResolvedValue({});
    (prisma.tokenBlacklist.deleteMany as jest.Mock).mockResolvedValue({ count: 3 });

    const res = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Logoff realizado com sucesso.",
      tokensExpiradosRemovidos: 3,
    });

    expect(prisma.tokenBlacklist.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ token: fakeToken }) })
    );
  });

  it("deve retornar 400 com mensagem se erro inesperado ocorrer", async () => {
    (prisma.tokenBlacklist.findUnique as jest.Mock).mockImplementation(() => {
      throw new Error("Erro inesperado");
    });

    const res = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro inesperado" });
  });

  it("deve retornar 400 com erro genérico se erro for string", async () => {
    (prisma.tokenBlacklist.findUnique as jest.Mock).mockImplementation(() => {
      throw "Erro desconhecido";
    });

    const res = await request(app)
      .post(route)
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Ocorreu um erro desconhecido, contate o administrador." });
  });
});
