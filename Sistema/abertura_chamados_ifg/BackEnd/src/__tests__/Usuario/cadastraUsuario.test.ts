// src/__tests__/cadastraUsuario.test.ts

import request from "supertest";
import express from "express";
import cadastraUserRouter from "../../Routes/Usuario/cadastraUsuario";

// Mock do Prisma Client
jest.mock("../../lib/prisma", () => ({
__esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import prisma from "../../lib/prisma";

// Mock das funções auxiliares
jest.mock("../../Services/funcoes/criaSenha", () => ({
  criaSenha: jest.fn(() => "SenhaMockada123"),
}));

jest.mock("../../Services/EnviarEmail/enviarEmail", () => ({
  enviaEmail: jest.fn(() => Promise.resolve({ ok: true })),
}));

// Importa os mocks para uso nos testes
import { criaSenha } from "../../Services/funcoes/criaSenha";
import { enviaEmail } from "../../Services/EnviarEmail/enviarEmail";

// Cria o app Express temporário com a rota em teste
const app = express();
app.use(express.json());
app.use(cadastraUserRouter);

describe("POST /cadastraUsuario", () => {
  
  const mockPrisma = prisma as unknown as { //Se fez necessário, nao consegui utilizar o Resolved e o RejectedValue
   usuario: {
    findUnique: jest.Mock;
    create: jest.Mock;
   };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve cadastrar um novo usuário com sucesso", async () => {
    // Simula que o usuário não existe
    mockPrisma.usuario.findUnique.mockResolvedValue(null);

    // Simula criação do usuário
    mockPrisma.usuario.create.mockResolvedValue({
      id: "1",
      nome: "Usuário Teste",
      matricula: "1234567890",
      email: "teste@teste.com",
      tipoUsuario: "ADMIN",
    });

    // Envia a requisição
    const res = await request(app).post("/cadastraUsuario").send({
      nome: "Usuário Teste",
      matricula: "1234567890",
      email: "teste@teste.com",
      tipoUsuario: "ADMIN",
    });

    // Valida resposta
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Usuário cadastrado com sucesso",
      usuario: {
        id: "1",
        nome: "Usuário Teste",
        matricula: "1234567890",
        email: "teste@teste.com",
        tipoUsuario: "ADMIN",
      },
    });

    // Valida chamadas dos mocks
    expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { matricula: "1234567890" },
    });
    expect(mockPrisma.usuario.create).toHaveBeenCalled();
    expect(criaSenha).toHaveBeenCalled();
    expect(enviaEmail).toHaveBeenCalledWith("1234567890");
  });

  it("deve retornar erro se matrícula já estiver cadastrada", async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue({ id: "existente" });

    const res = await request(app).post("/cadastraUsuario").send({
      nome: "Repetido",
      matricula: "1234567890",
      email: "repetido@teste.com",
      tipoUsuario: "ADMIN",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Matrícula já cadastrada" });
  });

  it("deve retornar erro de validação se dados forem inválidos", async () => {
    const res = await request(app).post("/cadastraUsuario").send({
      nome: "A", // nome muito curto
      matricula: "", // inválida
      email: "email_invalido", // formato errado
      tipoUsuario: "", // obrigatório
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error"); // Pode ser objeto do Zod ou string
  });

  it("deve retornar erro se falhar ao enviar email", async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(null);
    mockPrisma.usuario.create.mockResolvedValue({
      id: "2",
      nome: "Erro Email",
      matricula: "2222222222",
      email: "erro@email.com",
      tipoUsuario: "ADMIN",
    });

    (enviaEmail as jest.Mock).mockResolvedValue({ ok: false });

    const res = await request(app).post("/cadastraUsuario").send({
      nome: "Erro Email",
      matricula: "2222222222",
      email: "erro@email.com",
      tipoUsuario: "ADMIN",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro ao enviar email" });
  });

  it("deve retornar erro 500 se ocorrer erro inesperado", async () => {
    mockPrisma.usuario.findUnique.mockRejectedValue(new Error("Falha interna"));

    const res = await request(app).post("/cadastraUsuario").send({
      nome: "Falha Interna",
      matricula: "9999999999",
      email: "erro@servidor.com",
      tipoUsuario: "ADMIN",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro interno do servidor" });
  });
});
