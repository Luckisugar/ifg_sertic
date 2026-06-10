import request from 'supertest';
import { app } from '../../app'; // Ajuste o caminho para o seu arquivo app.ts
import prisma from '../../lib/prisma'; // Ajuste o caminho para o seu prisma client

// Dados de teste para criar usuários no banco
const usuariosDeTeste = [
  {
    nome: 'Usuario 1',
    matricula: '11111111112',
    email: 'usuario1@teste.com',
    senha: 'senha123',
    tipoUsuario: 'ADMIN',
  },
  {
    nome: 'Usuario 2',
    matricula: '22222222221',
    email: 'usuario2@teste.com',
    senha: 'senha456',
    tipoUsuario: 'ENCARREGADO',
  },
];

// --- Estrutura do Teste ---
describe('Teste de Integracao - Busca de Usuários', () => {
  
  beforeEach(async () => {
    await prisma.usuario.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Cenário 1: Retorna usuários quando eles existem ---
  it('deve retornar uma lista de usuários com status 200', async () => {
    // 1. Cria usuários no banco de dados para o teste
    await prisma.usuario.createMany({
      data: usuariosDeTeste,
    });

    // 2. Faz a requisição GET para a rota de busca
    const response = await request(app)
      .get('/usuario/buscaUsuarios')
      .expect(200);

    // 3. Verifica se a resposta é um array e se tem o número correto de itens
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(usuariosDeTeste.length);

    // 4. Verifica a estrutura de cada objeto na resposta
    const usuariosRetornados = response.body;
    expect(usuariosRetornados[0]).toHaveProperty('id');
    expect(usuariosRetornados[0]).toHaveProperty('nome', usuariosDeTeste[0].nome);

    expect(usuariosRetornados[1]).toHaveProperty('id');
    expect(usuariosRetornados[1]).toHaveProperty('nome', usuariosDeTeste[1].nome);
  });

  // --- Cenário 2: Retorna um array vazio quando não há usuários ---
  it('deve retornar um array vazio se não houver usuários cadastrados', async () => {
    // 1. O beforeEach já garante que o banco está limpo.

    // 2. Faz a requisição GET para a rota de busca
    const response = await request(app)
      .get('/usuario/buscaUsuarios') // Corrigido para o caminho completo e com a barra
      .expect(200);

    // 3. Verifica se a resposta é um array vazio
    expect(response.body).toEqual([]);
    expect(response.body).toHaveLength(0);
  });
});