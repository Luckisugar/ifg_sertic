import request from 'supertest';
import express from 'express';
import atulizaEquipRouter from '../../Routes/Equipamento/atualizaEquipamento';


jest.mock("../../lib/prisma", () => ({
  equipamento: {
    update: jest.fn(),
  },
}));

import prisma from "../../lib/prisma";

const app = express();
app.use(express.json());
app.use(atulizaEquipRouter);

describe('PUT /atualizaEquipamento', () => {
  it('deve atualizar o equipamento com sucesso', async () => {
    // simula que o update foi feito sem erro
    (prisma.equipamento.update as jest.Mock).mockResolvedValue({});

    const response = await request(app).put('/atualizaEquipamento').send({
      id: 1,
      st_ativo: true,
    });

    expect(response.status).toBe(200);
    expect(prisma.equipamento.update).toHaveBeenCalledTimes(1);
    expect(prisma.equipamento.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { st_ativo: true },
    });
  });

  it('deve retornar erro 400 se id ou st_ativo estiverem incorretos', async () => {
    const response = await request(app).put('/atualizaEquipamento').send({
      st_ativo: 'sim', // inválido
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("ID e status são obrigatórios");
  });

  it("deve retornar erro genérico se erro não for instância de Error", async () => {
  // Simula uma exceção que **não** é Error (string, por exemplo)
  (prisma.equipamento.update as jest.Mock).mockRejectedValue("erro como string");

  const response = await request(app).put("/atualizaEquipamento").send({
    id: 1,
    st_ativo: true,
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: "Ocorreu um erro desconhecido contate o administrador",});
  });

  it('deve retornar erro 400 se ocorrer uma exceção', async () => {
    (prisma.equipamento.update as jest.Mock).mockRejectedValue(new Error('Erro interno'));

    const response = await request(app).put('/atualizaEquipamento').send({
      id: 1,
      st_ativo: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Erro interno');
  });
});
