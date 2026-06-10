import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

// Dados de teste para os diferentes cenários
const locaisAtivos = [
  {
    nome: 'Sala 101',
    st_ativo: true,
  },
  {
    nome: 'Laboratorio de Informatica',
    st_ativo: true,
  },
];

const localInativo = {
  nome: 'Sala de Teste Inativa',
  st_ativo: false,
};

describe('Teste de Integracao - Busca de Locais Ativos', () => {

  beforeEach(async () => {
    await prisma.local.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve retornar apenas locais com st_ativo como true', async () => {
    await prisma.local.createMany({
      data: [...locaisAtivos, localInativo],
    });

    const response = await request(app)
      .get('/local/buscaLocalAtivo')
      .expect(200);

    expect(response.body).toHaveProperty('localExistente');
    expect(response.body.localExistente).toHaveLength(locaisAtivos.length);

    const locaisRetornados = response.body.localExistente;

    expect(locaisRetornados[0]).toHaveProperty('id');
    expect(locaisRetornados[0].nome).toBe(locaisAtivos[0].nome);
    expect(locaisRetornados[0].st_ativo).toBe(true);

    expect(locaisRetornados[1]).toHaveProperty('id');
    expect(locaisRetornados[1].nome).toBe(locaisAtivos[1].nome);
    expect(locaisRetornados[1].st_ativo).toBe(true);
  });

  it('deve retornar um array vazio se não houver locais ativos', async () => {
    await prisma.local.create({
      data: localInativo,
    });

    const response = await request(app)
      .get('/local/buscaLocalAtivo')
      .expect(200);

    expect(response.body).toHaveProperty('localExistente');
    expect(response.body.localExistente).toEqual([]);
  });
});