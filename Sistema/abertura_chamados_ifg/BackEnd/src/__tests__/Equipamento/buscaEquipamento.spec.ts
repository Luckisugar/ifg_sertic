import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

const equipamentosDeTeste = [
  {
    nome: 'Computador',
    st_ativo: true,
  },
  {
    nome: 'Projetor',
    st_ativo: false,
  },
];

describe('Teste de Integracao - Busca de Equipamentos', () => {

  beforeEach(async () => {
    await prisma.equipamento.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve retornar uma lista de todos os equipamentos com status 200', async () => {
    await prisma.equipamento.createMany({
      data: equipamentosDeTeste,
    });

    const response = await request(app)
      .get('/equipamento/buscaEquipamentos')
      .expect(200);

    expect(response.body).toHaveProperty('equipamentoExistente');
    expect(response.body.equipamentoExistente).toHaveLength(equipamentosDeTeste.length);

    const equipamentosRetornados = response.body.equipamentoExistente;

    expect(equipamentosRetornados[0]).toHaveProperty('id');
    expect(equipamentosRetornados[0].nome).toBe(equipamentosDeTeste[0].nome);
    expect(equipamentosRetornados[0].st_ativo).toBe(equipamentosDeTeste[0].st_ativo);

    expect(equipamentosRetornados[1]).toHaveProperty('id');
    expect(equipamentosRetornados[1].nome).toBe(equipamentosDeTeste[1].nome);
    expect(equipamentosRetornados[1].st_ativo).toBe(equipamentosDeTeste[1].st_ativo);
  });

  it('deve retornar um array vazio se não houver equipamentos cadastrados', async () => {

    const response = await request(app)
      .get('/equipamento/buscaEquipamentos')
      .expect(200);

    expect(response.body).toHaveProperty('equipamentoExistente');
    expect(response.body.equipamentoExistente).toEqual([]);
  });
});