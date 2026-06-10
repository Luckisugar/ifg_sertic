import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

// Dados de teste para os diferentes cenários
const equipamentosAtivos = [
  {
    nome: 'Computador',
    st_ativo: true,
  },
  {
    nome: 'Projetor',
    st_ativo: true,
  },
];

const equipamentoInativo = {
  nome: 'Equipamento Inativo',
  st_ativo: false,
};

describe('Teste de Integracao - Busca de Equipamentos Ativos', () => {

  beforeEach(async () => {
    await prisma.equipamento.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve retornar apenas equipamentos com st_ativo como true', async () => {
    await prisma.equipamento.createMany({
      data: [...equipamentosAtivos, equipamentoInativo],
    });

    const response = await request(app)
      .get('/equipamento/buscaEquipamentosAtivo')
      .expect(200);

    expect(response.body).toHaveProperty('equipamentoExistente');
    expect(response.body.equipamentoExistente).toHaveLength(equipamentosAtivos.length);

    const equipamentosRetornados = response.body.equipamentoExistente;

    expect(equipamentosRetornados[0]).toHaveProperty('id');
    expect(equipamentosRetornados[0].nome).toBe(equipamentosAtivos[0].nome);
    expect(equipamentosRetornados[0].st_ativo).toBe(true);

    expect(equipamentosRetornados[1]).toHaveProperty('id');
    expect(equipamentosRetornados[1].nome).toBe(equipamentosAtivos[1].nome);
    expect(equipamentosRetornados[1].st_ativo).toBe(true);
  });

  it('deve retornar um array vazio se não houver equipamentos ativos', async () => {
    await prisma.equipamento.create({
      data: equipamentoInativo,
    });

    const response = await request(app)
      .get('/equipamento/buscaEquipamentosAtivo')
      .expect(200);

    expect(response.body).toHaveProperty('equipamentoExistente');
    expect(response.body.equipamentoExistente).toEqual([]);
  });
});