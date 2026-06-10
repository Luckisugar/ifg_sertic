import request from "supertest";
import express from "express";
import uploadImagemRouter from "../../Routes/uploadImagem";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    imagemTeste: {
      create: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(uploadImagemRouter);

describe("POST /uploadImagem", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve salvar uma imagem com sucesso", async () => {
    (mockPrisma.imagemTeste.create as jest.Mock).mockResolvedValue({
      id: 1,
      nome: "imagem1.png",
      tipoMime: "image/png",
    });

    const res = await request(app)
      .post("/uploadImagem")
      .attach("imagem", Buffer.from("fake image content"), {
        filename: "imagem1.png",
        contentType: "image/png",
      })
      .field("nome", "imagem1.png");

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      message: "Imagem salva com sucesso",
    });

    expect(mockPrisma.imagemTeste.create).toHaveBeenCalledWith({
      data: {
        nome: "imagem1.png",
        imagem: expect.any(Buffer),
        tipoMime: "image/png",
      },
    });
  });

  it("deve retornar 400 se nome estiver ausente", async () => {
    const res = await request(app)
      .post("/uploadImagem")
      .attach("imagem", Buffer.from("fake image content"), {
        filename: "imagem2.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Nome e imagem são obrigatórios",
    });
  });

  it("deve retornar 400 se imagem estiver ausente", async () => {
    const res = await request(app)
      .post("/uploadImagem")
      .field("nome", "imagem2.png");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Nome e imagem são obrigatórios",
    });
  });

  it("deve retornar 500 em erro interno do servidor", async () => {
    (mockPrisma.imagemTeste.create as jest.Mock).mockRejectedValue(
      new Error("Erro de banco")
    );

    const res = await request(app)
      .post("/uploadImagem")
      .attach("imagem", Buffer.from("erro interno"), {
        filename: "falha.png",
        contentType: "image/png",
      })
      .field("nome", "falha.png");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Erro ao salvar imagem",
    });
  });
});
