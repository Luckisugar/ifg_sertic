import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

const equipamentoDeTeste = {
  nome: 'Equipamento para Atualizar',
  st_ativo: false,
};

describe('Teste de Integracao - Atualizar Equipamento', () => {

  beforeEach(async () => {
    await prisma.equipamento.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve atualizar o status de um equipamento e retornar 200', async () => {
    const novoEquipamento = await prisma.equipamento.create({
      data: equipamentoDeTeste,
    });

    await request(app)
      .put('/equipamento/atualizaEquipamento')
      .send({ id: novoEquipamento.id, st_ativo: true })
      .expect(200);

    const equipamentoAtualizado = await prisma.equipamento.findUnique({
      where: { id: novoEquipamento.id },
    });

    expect(equipamentoAtualizado?.st_ativo).toBe(true);
  });

  it('deve retornar um erro ao tentar atualizar um equipamento com ID inexistente', async () => {
    const idInexistente = 99999;

    const response = await request(app)
      .put('/equipamento/atualizaEquipamento')
      .send({ id: idInexistente, st_ativo: true })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Record to update not found.');
  });

  it('deve retornar 400 se o ID ou o status estiverem faltando', async () => {
    const responseSemId = await request(app)
      .put('/equipamento/atualizaEquipamento')
      .send({ st_ativo: true })
      .expect(400);

    expect(responseSemId.body).toHaveProperty('message', 'ID e status são obrigatórios');

    const responseSemStatus = await request(app)
      .put('/equipamento/atualizaEquipamento')
      .send({ id: 123 })
      .expect(400);

    expect(responseSemStatus.body).toHaveProperty('message', 'ID e status são obrigatórios');
  });
});