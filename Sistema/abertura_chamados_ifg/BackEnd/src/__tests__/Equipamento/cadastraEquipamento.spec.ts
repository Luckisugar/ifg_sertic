import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

const equipamentoValido = {
  nome: 'Equipamento de Teste',
};

const equipamentoInativo = {
  nome: 'Equipamento Inativo',
  st_ativo: false,
};

const equipamentoInvalido = {
  nome: 'ab',
};

describe('Teste de Integracao - Cadastro de Equipamento', () => {

  beforeEach(async () => {
    await prisma.equipamento.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve cadastrar um novo equipamento e retornar status 201', async () => {
    const response = await request(app)
      .post('/equipamento/cadastraEquipamento')
      .send(equipamentoValido)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Equipamento cadastrado com sucesso');
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(equipamentoValido.nome);
    expect(response.body.status).toBe(true);

    const equipamentoSalvo = await prisma.equipamento.findUnique({
      where: { id: response.body.id },
    });

    expect(equipamentoSalvo).toBeDefined();
    expect(equipamentoSalvo?.nome).toBe(equipamentoValido.nome);
    expect(equipamentoSalvo?.st_ativo).toBe(true);
  });

  it('deve reativar um equipamento inativo e retornar status 201', async () => {
    await prisma.equipamento.create({
      data: equipamentoInativo,
    });

    const response = await request(app)
      .post('/equipamento/cadastraEquipamento')
      .send(equipamentoValido)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Equipamento cadastrado com sucesso');
    expect(response.body.nome).toBe(equipamentoValido.nome);
    expect(response.body.status).toBe(true);

    const equipamentoAtualizado = await prisma.equipamento.findFirst({
      where: { nome: equipamentoValido.nome },
    });

    expect(equipamentoAtualizado?.st_ativo).toBe(true);
  });

  it('não deve cadastrar um equipamento já ativo e retornar status 400', async () => {
    await prisma.equipamento.create({
      data: equipamentoValido,
    });

    const response = await request(app)
      .post('/equipamento/cadastraEquipamento')
      .send(equipamentoValido)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Equipamento já cadastrado');
  });

  it('não deve cadastrar um equipamento com dados inválidos e retornar status 400', async () => {
    const response = await request(app)
      .post('/equipamento/cadastraEquipamento')
      .send(equipamentoInvalido)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(typeof response.body.error).toBe('string');
  });
});