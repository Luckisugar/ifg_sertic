import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

// Dados de teste para o local
const localDeTeste = {
  nome: 'Local para Atualizar',
  st_ativo: false,
};

describe('Teste de Integracao - Atualizar Local', () => {

  beforeEach(async () => {
    await prisma.local.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve atualizar o status de um local e retornar 200', async () => {
    const novoLocal = await prisma.local.create({
      data: localDeTeste,
    });

    await request(app)
      .put('/local/atualizaLocal')
      .send({ id: novoLocal.id, st_ativo: true })
      .expect(200);

    const localAtualizado = await prisma.local.findUnique({
      where: { id: novoLocal.id },
    });

    expect(localAtualizado?.st_ativo).toBe(true);
  });

  it('deve retornar um erro ao tentar atualizar um local com ID inexistente', async () => {
    const idInexistente = 99999;

    const response = await request(app)
      .put('/local/atualizaLocal')
      .send({ id: idInexistente, st_ativo: true })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Record to update not found.');
  });

  it('deve retornar 400 se o ID ou o status estiverem faltando', async () => {
    const responseSemId = await request(app)
      .put('/local/atualizaLocal')
      .send({ st_ativo: true })
      .expect(400);

    expect(responseSemId.body).toHaveProperty('message', 'ID e status são obrigatórios');

    const responseSemStatus = await request(app)
      .put('/local/atualizaLocal')
      .send({ id: 123 })
      .expect(400);

    expect(responseSemStatus.body).toHaveProperty('message', 'ID e status são obrigatórios');
  });
});