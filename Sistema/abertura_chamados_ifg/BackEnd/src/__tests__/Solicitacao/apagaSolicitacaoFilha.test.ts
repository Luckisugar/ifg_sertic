import request from 'supertest';
import express from 'express';
import apagaSolicitacaoFilha from '../../Routes/Solicitacao/apagaSolicitacaoFilha';

jest.mock('../../lib/prisma', () => ({
  chamado: {
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
}));

import prisma from '../../lib/prisma';

const app = express();
app.use(express.json());
app.use(apagaSolicitacaoFilha);

describe('DELETE /apagaSolicitacaoFilha/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve deletar a solicitação com sucesso', async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.chamado.delete as jest.Mock).mockResolvedValue({});

    const response = await request(app).delete('/apagaSolicitacaoFilha/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Solicitação deletada com sucesso');
    expect(prisma.chamado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.chamado.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deve retornar erro 400 se o ID for inválido', async () => {
    const response = await request(app).delete('/apagaSolicitacaoFilha/abc');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('ID da solicitação inválido');
    expect(prisma.chamado.findUnique).not.toHaveBeenCalled();
    expect(prisma.chamado.delete).not.toHaveBeenCalled();
  });

  it('deve retornar erro 404 se a solicitação não for encontrada', async () => {
    (prisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete('/apagaSolicitacaoFilha/999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Solicitação não encontrada');
    expect(prisma.chamado.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prisma.chamado.delete).not.toHaveBeenCalled();
  });

  it('deve retornar erro 500 em caso de falha interna', async () => {
    (prisma.chamado.findUnique as jest.Mock).mockImplementation(() => {
      throw new Error('Falha no banco');
    });

    const response = await request(app).delete('/apagaSolicitacaoFilha/1');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Erro interno do servidor');
  });
});
