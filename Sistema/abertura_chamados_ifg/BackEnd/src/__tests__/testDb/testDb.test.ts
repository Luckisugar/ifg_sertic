import request from "supertest";
import express from "express";
import testDbRouter from "../../Routes/testeDb";

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: {
    $queryRaw: jest.fn(),
  },
}));

import mockPrisma from "../../lib/prisma";

const app = express();
app.use(testDbRouter);

describe("GET /testDb", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar sucesso com resultado do banco", async () => {
    const fakeResult = [{ now: "2025-06-09T12:00:00.000Z" }];
    (mockPrisma.$queryRaw as jest.Mock).mockResolvedValue(fakeResult);

    const res = await request(app).get("/testDb");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      result: fakeResult,
    });

    expect(mockPrisma.$queryRaw).toHaveBeenCalledWith(expect.anything());
  });

  it("deve retornar erro 500 se ocorrer erro no banco", async () => {
    (mockPrisma.$queryRaw as jest.Mock).mockRejectedValue(new Error("Erro no banco"));

    const res = await request(app).get("/testDb");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: "Erro no banco",
    });

    expect(mockPrisma.$queryRaw).toHaveBeenCalled();
  });
});