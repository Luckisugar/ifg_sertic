import request from "supertest";
import express from "express";
import router from "../../Routes/getImagem";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    imagemTeste: {
      findUnique: jest.fn(),
    },
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(router);

describe("GET /imagem/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar a imagem se encontrada no banco", async () => {
    const fakeBuffer = Buffer.from("fake image data");
    (mockPrisma.imagemTeste.findUnique as jest.Mock).mockResolvedValue({
      imagem: fakeBuffer,
      tipoMime: "image/png",
    });

    const res = await request(app).get("/imagem/1");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/png");
    expect(res.body).toEqual(fakeBuffer);
    expect(mockPrisma.imagemTeste.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("deve retornar 404 se imagem não for encontrada", async () => {
    (mockPrisma.imagemTeste.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/imagem/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Imagem não encontrada" });
  });

  it("deve retornar 404 se imagem não possuir campo `imagem`", async () => {
    (mockPrisma.imagemTeste.findUnique as jest.Mock).mockResolvedValue({
      imagem: null,
      tipoMime: "image/jpeg",
    });

    const res = await request(app).get("/imagem/2");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Imagem não encontrada" });
  });

  it("deve retornar 500 se ocorrer erro inesperado", async () => {
    (mockPrisma.imagemTeste.findUnique as jest.Mock).mockRejectedValue(
      new Error("Erro de banco")
    );

    const res = await request(app).get("/imagem/3");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro ao buscar imagem" });
  });
});
