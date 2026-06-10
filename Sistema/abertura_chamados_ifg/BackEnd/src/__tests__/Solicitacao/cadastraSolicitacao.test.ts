import request from "supertest";
import express from "express";
import cadastraSolicitacaoRouter from "../../Routes/Solicitacao/cadastraSolicitacao";


jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    chamado: {
      create: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(express.json());
app.use(cadastraSolicitacaoRouter);

describe("POST /cadastraSolicitacao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const payload = {
    tipoSolicitacaoId: 1,
    solicitanteId: 2,
    localId: 3,
    equipamentoId: null,
    descricao: "Problema na iluminação da sala",
    assunto: "Iluminação",
    status: "NOVO",
    observacao: null,
    chamadoPaiId: null,
    cafe: null,
    dataHora: null,
    quantidadeCadeiras: null,
    subChamado: null,
  };

  it("deve cadastrar uma nova solicitação com campos nulos", async () => {
    (mockPrisma.chamado.create as jest.Mock).mockResolvedValue({
      id: 123,
    });

    const res = await request(app).post("/cadastraSolicitacao").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Solicitação cadastrada com sucesso",
      id: 123,
    });

    expect(mockPrisma.chamado.create).toHaveBeenCalledWith({
      data: {
        tipoSolicitacaoId: 1,
        solicitanteId: 2,
        localId: 3,
        equipamentoId: null,
        descricao: payload.descricao,
        assunto: payload.assunto,
        status: payload.status,
        observacao: null,
        chamadoPaiId: null,
        cafe: null,
        dataHora: null,
        quantidadeCadeiras: null,
      },
    });
  });

  it("deve retornar erro de validação se dados estiverem inválidos", async () => {
    const res = await request(app)
      .post("/cadastraSolicitacao")
      .send({ ...payload, descricao: "Curto" }); // inválido (min: 10)

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("A descrição e obrigatoria (minimo 10 caracteres)");
    expect(mockPrisma.chamado.create).not.toHaveBeenCalled();
  });

  it("deve retornar erro 500 em falha inesperada", async () => {
    (mockPrisma.chamado.create as jest.Mock).mockRejectedValue(
      new Error("Erro no banco")
    );

    const res = await request(app).post("/cadastraSolicitacao").send(payload);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Erro interno do servidor",
    });
  });
});
