import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

// Dados de teste para os diferentes cenários
const localValido = {
  nome: 'Local de Teste',
};

const localInativo = {
  nome: 'Local Inativo',
  st_ativo: false,
};

const localInvalido = {
  nome: 'ab', // Nome muito curto para a validação do Zod
};

describe('Teste de Integracao - Cadastro de Local', () => {
  
  beforeEach(async () => {
    await prisma.local.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve cadastrar um novo local e retornar status 201', async () => {
    const response = await request(app)
      .post('/local/cadastraLocal') 
      .send(localValido)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Local cadastrado com sucesso');
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(localValido.nome);
    expect(response.body.status).toBe(true);

    const localSalvo = await prisma.local.findUnique({
      where: { id: response.body.id },
    });

    expect(localSalvo).toBeDefined();
    expect(localSalvo?.nome).toBe(localValido.nome);
    expect(localSalvo?.st_ativo).toBe(true);
  });

  it('deve reativar um local inativo e retornar status 201', async () => {
    await prisma.local.create({
      data: localInativo,
    });

    const response = await request(app)
      .post('/local/cadastraLocal')
      .send(localValido)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Local cadastrado com sucesso');
    expect(response.body.nome).toBe(localValido.nome);
    expect(response.body.status).toBe(true);

    const localAtualizado = await prisma.local.findFirst({
      where: { nome: localValido.nome },
    });

    expect(localAtualizado?.st_ativo).toBe(true);
  });

  it('não deve cadastrar um local já ativo e retornar status 400', async () => {
    await prisma.local.create({
      data: localValido,
    });

    const response = await request(app)
      .post('/local/cadastraLocal')
      .send(localValido)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Local já cadastrado');
  });

  it('não deve cadastrar um local com dados inválidos e retornar status 400', async () => {
    const response = await request(app)
      .post('/local/cadastraLocal')
      .send(localInvalido)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(typeof response.body.error).toBe('string');
  });
});