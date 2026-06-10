import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma'; 

// Dados de teste para criar no banco de dados
const tiposDeTeste = [
  {
    nome: 'Reunião',
    descricao: 'Tipo de solicitação para agendar reuniões',
    st_ativo: true,
    dataHora: false,
    quantidadeCadeiras: false,
    cafe: false,
  },
  {
    nome: 'Manutenção',
    descricao: 'Tipo de solicitação para manutenção de equipamentos',
    st_ativo: true,
    dataHora: true,
    quantidadeCadeiras: false,
    cafe: false,
  },
];

describe('Teste de Integracao - Busca de Tipos de Solicitação', () => {

  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await prisma.tipoSolicitacao.deleteMany();
  });

  // Fecha a conexão do prisma após todos os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });

  //Cenário 1: Retorna tipos de solicitação quando existem
  it('deve retornar uma lista de tipos de solicitacao com status 200', async () => {
    // 1. Cria dados de teste diretamente no banco
    await prisma.tipoSolicitacao.createMany({
      data: tiposDeTeste,
    });

    // 2. Faz a requisição para a rota de busca
    const response = await request(app)
      .get('/solicitacao/buscaTipoSolicitacoes')
      .expect(200);

    // 3. Verifica se a resposta contém o array de dados e se ele tem o tamanho correto
    expect(response.body).toHaveProperty('tipoExistente');
    expect(Array.isArray(response.body.tipoExistente)).toBe(true);
    expect(response.body.tipoExistente).toHaveLength(tiposDeTeste.length);

    const tiposRetornados = response.body.tipoExistente;

    // 4. Verifica se a estrutura e o conteúdo dos dados estão corretos
    expect(tiposRetornados[0]).toHaveProperty('id');
    expect(tiposRetornados[0].nome).toBe(tiposDeTeste[0].nome);
    expect(tiposRetornados[0].descricao).toBe(tiposDeTeste[0].descricao);

    expect(tiposRetornados[1]).toHaveProperty('id');
    expect(tiposRetornados[1].nome).toBe(tiposDeTeste[1].nome);
    expect(tiposRetornados[1].descricao).toBe(tiposDeTeste[1].descricao);
  });

  // Cenário 2: Retorna um array vazio quando não há dados
  it('deve retornar um array vazio se não houver tipos de solicitacao', async () => {
    // O beforeEach já garante que o banco está vazio

    // 1. Faz a requisição GET para a rota de busca
    const response = await request(app)
      .get('/solicitacao/buscaTipoSolicitacoes')
      .expect(200);

    // 2. Verifica se a resposta contém um array vazio
    expect(response.body).toHaveProperty('tipoExistente');
    expect(response.body.tipoExistente).toEqual([]);
  });
});