import request from "supertest";
import express from "express";
import buscaTipoSolRouter from "../../Routes/tipoSolicitacao/buscaTipoSolicitacaoAtiva";

// Mock do Prisma
jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    tipoSolicitacao: {
      findMany: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

// App Express temporário
const app = express();
app.use(express.json());
app.use(buscaTipoSolRouter);

describe("GET /buscaTipoSolicitacoesAtiva", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todos os tipos de solicitação ativas com campos front corretos", async () => {
    (mockPrisma.tipoSolicitacao.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        nome: "Manutenção",
        st_ativo: true,
        dataHora: true,
        cafe: true,
        quantidadeCadeiras: true,
      },
      {
        id: 2,
        nome: "Reunião",
        st_ativo: true,
        dataHora: false,
        cafe: true,
        quantidadeCadeiras: false,
      },
    ]);

    const res = await request(app).get("/buscaTipoSolicitacoesAtiva");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      tipoExistente: [
        {
          id: 1,
          nome: "Manutenção",
          st_ativo: true,
          dataHora: true,
          cafe: true,
          quantidadeCadeiras: true,
          front: {
            tipo: "Manutenção",
            campos: [
              {
                nome: "dataHora",
                label: "Data e hora",
                tipo: "dateHora",
              },
              {
                nome: "servirCafe",
                label: "Servir café",
                tipo: "checkbox",
                opcoes: ["Sim", "Não"],
              },
              {
                nome: "quantidadeCadeiras",
                label: "Quantidade de cadeiras",
                tipo: "text",
              },
            ],
          },
        },
        {
          id: 2,
          nome: "Reunião",
          st_ativo: true,
          dataHora: false,
          cafe: true,
          quantidadeCadeiras: false,
          front: {
            tipo: "Reunião",
            campos: [
              {
                nome: "servirCafe",
                label: "Servir café",
                tipo: "checkbox",
                opcoes: ["Sim", "Não"],
              },
            ],
          },
        },
      ],
    });
    expect(mockPrisma.tipoSolicitacao.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.tipoSolicitacao.findMany).toHaveBeenCalledWith({
      where: { st_ativo: true },
    });
  });

  it("deve retornar erro 400 se ocorrer falha no servidor", async () => {
    (mockPrisma.tipoSolicitacao.findMany as jest.Mock).mockRejectedValue(
      new Error("Falha ao buscar tipos de solicitação")
    );

    const res = await request(app).get("/buscaTipoSolicitacoesAtiva");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Falha ao buscar tipos de solicitação" });
  });

  it("deve retornar erro 400 se erro desconhecido for lançado", async () => {
    (mockPrisma.tipoSolicitacao.findMany as jest.Mock).mockRejectedValue("erro desconhecido");

    const res = await request(app).get("/buscaTipoSolicitacoesAtiva");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Ocorreu um erro desconhecido contate o administrador",
    });
  });
});
