import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

const tipoSolicitacaoTeste = {
  nome: 'Atualizar Teste',
  descricao: 'Tipo para teste de atualização',
  st_ativo: false,
  dataHora: true,
  quantidadeCadeiras: true,
  cafe: true,
};

describe('Teste de Integracao - Atualizar Tipo de Solicitação', () => {
  beforeEach(async () => {
    await prisma.tipoSolicitacao.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve atualizar o status de um tipo de solicitacao e retornar 200', async () => {
    const novoTipo = await prisma.tipoSolicitacao.create({
      data: tipoSolicitacaoTeste,
    });

    await request(app)
      .put('/solicitacao/atualizaTipoSolicitacao')
      .send({ id: novoTipo.id, st_ativo: true })
      .expect(200);

    const tipoAtualizado = await prisma.tipoSolicitacao.findUnique({
      where: { id: novoTipo.id },
    });

    expect(tipoAtualizado?.st_ativo).toBe(true);
  });

  it('deve retornar um erro ao tentar atualizar um tipo de solicitacao com ID inexistente', async () => {
    const idInexistente = 99999;

    const response = await request(app)
      .put('/solicitacao/atualizaTipoSolicitacao')
      .send({ id: idInexistente, st_ativo: true })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Record to update not found.');
  });

  it('deve retornar 400 se o ID ou o status estiverem faltando', async () => {
    const responseSemId = await request(app)
      .put('/solicitacao/atualizaTipoSolicitacao')
      .send({ st_ativo: true })
      .expect(400);

    expect(responseSemId.body).toHaveProperty('message', 'ID e status são obrigatórios');

    const responseSemStatus = await request(app)
      .put('/solicitacao/atualizaTipoSolicitacao')
      .send({ id: 123 })
      .expect(400);

    expect(responseSemStatus.body).toHaveProperty('message', 'ID e status são obrigatórios');
  });
});