import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import loginRouter from "../../Routes/auth/login";
// Mocks
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../Services/funcoes/validarSenha", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import prisma from "../../lib/prisma";
import validatePassword from "../../Services/funcoes/validarSenha";

const app = express();
app.use(express.json());
app.use(loginRouter);

describe("POST /login", () => {
  const route = "/login";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 400 se matrícula ou senha não forem fornecidos", async () => {
    const res = await request(app).post(route).send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Matrícula e senha são obrigatórios." });
  });

  it("deve retornar 404 se usuário não for encontrado", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post(route).send({
      matricula: "12345678901",
      password: "senha123",
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Usuário não encontrado!" });
  });

  it("deve retornar 401 se a senha for inválida", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      senha: "senhaHasheada",
      tipoUsuario: "admin",
    });

    jest.mocked(validatePassword).mockResolvedValue(false);

    const res = await request(app).post(route).send({
      matricula: "12345678901",
      password: "senhaErrada",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Erro no login. Verifique suas credenciais." });
  });

  it("deve retornar 200 e token se login for bem-sucedido", async () => {
    const user = {
      id: 1,
      senha: "senhaHasheada",
      tipoUsuario: "admin",
    };

    (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(user);
    (validatePassword as jest.Mock).mockResolvedValue(true);

    // Mock do jwt.sign
    const fakeToken = "fake.jwt.token";
    (jest.spyOn(jwt, "sign") as jest.Mock).mockReturnValue(fakeToken);

    const res = await request(app).post(route).send({
      matricula: "12345678901",
      password: "senha123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Login bem-sucedido!",
      token: fakeToken,
      tipoUsuario: "admin",
    });

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: user.id, tipoUsuario: user.tipoUsuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  it("deve retornar 400 com mensagem se erro for instância de Error", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockImplementation(() => {
      throw new Error("Erro controlado");
    });

    const res = await request(app).post(route).send({
      matricula: "12345678901",
      password: "senha123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Erro controlado" });
  });

  it("deve retornar 400 com erro genérico se erro não for instância de Error", async () => {
    (prisma.usuario.findUnique as jest.Mock).mockImplementation(() => {
      throw "Erro desconhecido";
    });

    const res = await request(app).post(route).send({
      matricula: "12345678901",
      password: "senha123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Ocorreu um erro desconhecido, contate o administrador." });
  });
});
