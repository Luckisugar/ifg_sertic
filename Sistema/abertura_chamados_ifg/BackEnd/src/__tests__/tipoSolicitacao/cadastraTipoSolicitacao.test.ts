import request from "supertest";
import express from "express";
import cadastraTipoSolRouter from "../../Routes/tipoSolicitacao/cadastraTipoSolicitacao";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    tipoSolicitacao: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(express.json());
app.use(cadastraTipoSolRouter);

describe("POST /cadastraTipoSolicitacao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const payload = {
    nome: "Reunião",
    descricao: "Solicitação para reunião mensal",
    dataHora: true,
    quantidadeCadeiras: true,
    cafe: true,
  };

  it("deve cadastrar um novo tipo de solicitação", async () => {
    (mockPrisma.tipoSolicitacao.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.tipoSolicitacao.create as jest.Mock).mockResolvedValue({
      id: 1,
      nome: payload.nome,
      st_ativo: true,
    });

    const res = await request(app)
      .post("/cadastraTipoSolicitacao")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Tipo de chamado cadastrado com sucesso",
      id: 1,
      nome: payload.nome,
      status: true,
    });

    expect(mockPrisma.tipoSolicitacao.findFirst).toHaveBeenCalledWith({
      where: { nome: payload.nome },
    });

    expect(mockPrisma.tipoSolicitacao.create).toHaveBeenCalledWith({
      data: payload,
    });
  });

  it("deve retornar erro se tipo de solicitação já estiver ativo", async () => {
    (mockPrisma.tipoSolicitacao.findFirst as jest.Mock).mockResolvedValue({
      id: 2,
      nome: payload.nome,
      st_ativo: true,
    });

    const res = await request(app)
      .post("/cadastraTipoSolicitacao")
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Tipo de solicitação já cadastrado",
    });
  });

  it("deve reativar um tipo de solicitação inativo", async () => {
    (mockPrisma.tipoSolicitacao.findFirst as jest.Mock).mockResolvedValue({
      id: 3,
      nome: payload.nome,
      st_ativo: false,
    });

    (mockPrisma.tipoSolicitacao.update as jest.Mock).mockResolvedValue({
      id: 3,
      nome: payload.nome,
      st_ativo: true,
    });

    const res = await request(app)
      .post("/cadastraTipoSolicitacao")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "solicitação cadastrado com sucesso",
      id: 3,
      nome: payload.nome,
      status: true,
    });

    expect(mockPrisma.tipoSolicitacao.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { st_ativo: true },
    });
  });

  it("deve retornar erro de validação se dados forem inválidos", async () => {
    const res = await request(app)
      .post("/cadastraTipoSolicitacao")
      .send({ ...payload, nome: "" }); // Nome inválido

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("deve retornar erro 500 se ocorrer erro inesperado", async () => {
    (mockPrisma.tipoSolicitacao.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.tipoSolicitacao.create as jest.Mock).mockRejectedValue(
      new Error("Erro de banco")
    );

    const res = await request(app)
      .post("/cadastraTipoSolicitacao")
      .send(payload);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Erro interno do servidor",
    });
  });
});
