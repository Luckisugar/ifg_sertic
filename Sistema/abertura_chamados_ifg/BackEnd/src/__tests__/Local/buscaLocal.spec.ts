import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

const locaisDeTeste = [
  {
    nome: 'Sala 101',
    st_ativo: true,
  },
  {
    nome: 'Laboratorio de Informatica',
    st_ativo: false, // Um local inativo deve ser incluído na busca geral
  },
];

describe('Teste de Integracao - Busca de Locais', () => {

  beforeEach(async () => {
    await prisma.local.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve retornar uma lista de todos os locais com status 200', async () => {
    await prisma.local.createMany({
      data: locaisDeTeste,
    });

    const response = await request(app)
      .get('/local/buscaLocais')
      .expect(200);

    expect(response.body).toHaveProperty('localExistente');
    expect(response.body.localExistente).toHaveLength(locaisDeTeste.length);

    const locaisRetornados = response.body.localExistente;

    expect(locaisRetornados[0]).toHaveProperty('id');
    expect(locaisRetornados[0].nome).toBe(locaisDeTeste[0].nome);
    expect(locaisRetornados[0].st_ativo).toBe(locaisDeTeste[0].st_ativo);

    expect(locaisRetornados[1]).toHaveProperty('id');
    expect(locaisRetornados[1].nome).toBe(locaisDeTeste[1].nome);
    expect(locaisRetornados[1].st_ativo).toBe(locaisDeTeste[1].st_ativo);
  });

  it('deve retornar um array vazio se não houver locais cadastrados', async () => {

    const response = await request(app)
      .get('/local/buscaLocais')
      .expect(200);

    expect(response.body).toHaveProperty('localExistente');
    expect(response.body.localExistente).toEqual([]);
  });
});