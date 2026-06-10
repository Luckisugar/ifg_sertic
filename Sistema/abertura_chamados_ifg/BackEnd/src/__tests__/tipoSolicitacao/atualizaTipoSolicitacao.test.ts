import request from 'supertest';
import express from 'express';
import atualizaTipoSolRouter from '../../Routes/tipoSolicitacao/atualizaTipoSolicitacao';

jest.mock('../../lib/prisma', () => ({
  tipoSolicitacao: {
    update: jest.fn(),
  },
}));

import prisma from '../../lib/prisma';

const app = express();
app.use(express.json());
app.use(atualizaTipoSolRouter);

describe('PUT /atualizaTipoSolicitacao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar o tipo de solicitação com sucesso', async () => {
    (prisma.tipoSolicitacao.update as jest.Mock).mockResolvedValue({});

    const response = await request(app).put('/atualizaTipoSolicitacao').send({
      id: 1,
      st_ativo: true,
    });

    expect(response.status).toBe(200);
    expect(prisma.tipoSolicitacao.update).toHaveBeenCalledTimes(1);
    expect(prisma.tipoSolicitacao.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { st_ativo: true },
    });
  });

  it('deve retornar erro 400 se id ou st_ativo forem inválidos', async () => {
    const response = await request(app).put('/atualizaTipoSolicitacao').send({
      st_ativo: 'sim', // inválido
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('ID e status são obrigatórios');
  });

  it('deve retornar erro 400 se ocorrer uma exceção com mensagem', async () => {
    (prisma.tipoSolicitacao.update as jest.Mock).mockRejectedValue(
      new Error('Erro interno')
    );

    const response = await request(app).put('/atualizaTipoSolicitacao').send({
      id: 1,
      st_ativo: false,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Erro interno');
  });

  it('deve retornar erro 400 para erro desconhecido sem mensagem', async () => {
    (prisma.tipoSolicitacao.update as jest.Mock).mockRejectedValue('erro desconhecido');

    const response = await request(app).put('/atualizaTipoSolicitacao').send({
      id: 1,
      st_ativo: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ocorreu um erro desconhecido contate o administrador');
  });
});
