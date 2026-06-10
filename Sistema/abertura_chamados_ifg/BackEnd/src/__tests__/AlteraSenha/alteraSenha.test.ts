import request from "supertest";
import express from "express";
import alteraSenhaRouter from "../../Routes/AlteraSenha/alteraSenha";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../Services/funcoes/criptografaSenha", () => ({
  __esModule: true,
  hashPassword: jest.fn(() => Promise.resolve("senhaHasheada")),
}));

import mockPrisma from "../../lib/prisma";
import { hashPassword } from "../../Services/funcoes/criptografaSenha";

const app = express();
app.use(express.json());
app.use(alteraSenhaRouter);

describe("PUT /alteraSenha", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const route = "/alteraSenha";

  it("deve alterar a senha com sucesso", async () => {
    (mockPrisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (mockPrisma.usuario.update as jest.Mock).mockResolvedValue({});

    const res = await request(app).put(route).send({
      senha: "novaSenha123",
      confirmacaoSenha: "novaSenha123",
      matricula: "12345678901",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Operação realizada com sucesso!",
      ok: true,
    });

    expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { matricula: "12345678901" },
      select: { id: true },
    });

    expect(hashPassword).toHaveBeenCalledWith("novaSenha123");

    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { senha: "senhaHasheada" },
    });
  });

  it("deve retornar erro se os campos estiverem vazios", async () => {
    const res = await request(app).put(route).send({
      senha: "",
      confirmacaoSenha: "",
      matricula: "12345678901",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Preencha todos os campos!",
      ok: false,
    });
  });

  it("deve retornar erro se as senhas forem diferentes", async () => {
    const res = await request(app).put(route).send({
      senha: "senha1",
      confirmacaoSenha: "senha2",
      matricula: "12345",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "As senhas não são iguais!",
      ok: false,
    });
  });

  it("deve retornar erro se usuário não for encontrado", async () => {
    (mockPrisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).put(route).send({
      senha: "senha123",
      confirmacaoSenha: "senha123",
      matricula: "99999",
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Usuário solicitado para alteração de senha não encontrado!",
      ok: false,
    });
  });

  it("deve retornar erro genérico para erro desconhecido não Error", async () => {
  // Forçar prisma.usuario.findUnique a lançar um erro que não é Error, ex: string
  (mockPrisma.usuario.findUnique as jest.Mock).mockImplementation(() => {
    throw "Erro inesperado como string";
  });

  const res = await request(app).put(route).send({
    senha: "novaSenha123",
    confirmacaoSenha: "novaSenha123",
    matricula: "12345678901",
  });

  expect(res.status).toBe(400);
  expect(res.body).toEqual({
    error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });


  it("deve retornar erro 400 em falha inesperada", async () => {
    (mockPrisma.usuario.findUnique as jest.Mock).mockRejectedValue(
      new Error("Falha inesperada")
    );

    const res = await request(app).put(route).send({
      senha: "senha123",
      confirmacaoSenha: "senha123",
      matricula: "12345",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Falha inesperada",
    });
  });
});
