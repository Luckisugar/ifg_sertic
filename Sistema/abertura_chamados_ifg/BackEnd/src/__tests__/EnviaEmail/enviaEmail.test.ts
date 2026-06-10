import request from "supertest";
import express from "express";
import emailRouter from "../../Routes/EnviaEmail/enviaEmail";

// Mocks
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../Services/funcoes/enviarEmail", () => ({
  __esModule: true,
  enviarEmail: jest.fn(),
}));

jest.mock("../../Services/funcoes/mascaraEmail", () => ({
  __esModule: true,
  mascararEmail: jest.fn(),
}));

import prisma from "../../lib/prisma";
import { enviarEmail } from "../../Services/funcoes/enviarEmail";
import { mascararEmail } from "../../Services/funcoes/mascaraEmail";

const app = express();
app.use(express.json());
app.use(emailRouter);

describe("POST /enviaEmail", () => {
  const route = "/enviaEmail";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 400 se matricula não for enviada", async () => {
    const res = await request(app).post(route).send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "O campo 'matricula' é obrigatório.", ok: false });
  });

  it("deve retornar 404 se usuário não for encontrado", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post(route).send({ matricula: "123" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Usuário não encontrado!", ok: false });
  });

  it("deve enviar email e retornar sucesso com email mascarado", async () => {
    const mockUser = { email: "teste@example.com", matricula: "123" };
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (enviarEmail as jest.Mock).mockResolvedValue(undefined);
    (mascararEmail as jest.Mock).mockReturnValue("t***@example.com");

    const res = await request(app).post(route).send({ matricula: "123" });

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { matricula: "123" },
      select: { email: true, matricula: true },
    });

    expect(enviarEmail).toHaveBeenCalledWith(mockUser.email, mockUser.matricula);
    expect(mascararEmail).toHaveBeenCalledWith(mockUser.email);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Operação realizada com sucesso!",
      email: "t***@example.com",
      ok: true,
    });
  });

  it("deve retornar erro 400 com mensagem se erro for instancia de Error", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockImplementation(() => {
      throw new Error("Erro esperado");
    });

    const res = await request(app).post(route).send({ matricula: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro esperado", ok: false });
  });

  it("deve retornar erro genérico 400 se erro não for instancia de Error", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockImplementation(() => {
      throw "Erro estranho";
    });

    const res = await request(app).post(route).send({ matricula: "123" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Ocorreu um erro desconhecido contate o administrador", ok: false });
  });
});
