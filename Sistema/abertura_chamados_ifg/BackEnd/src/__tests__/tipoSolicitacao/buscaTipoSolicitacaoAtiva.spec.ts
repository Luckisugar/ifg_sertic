import request from 'supertest';
import { app } from '../../app';
import prisma from '../../lib/prisma';

// Dados de teste para os diferentes cenários
const tiposAtivos = [
  {
    nome: 'Reuniao',
    descricao: 'Tipo de solicitação para agendar reuniões',
    st_ativo: true,
    dataHora: true,
    quantidadeCadeiras: true,
    cafe: true,
  },
  {
    nome: 'Manutencao',
    descricao: 'Tipo de solicitação para manutenção de equipamentos',
    st_ativo: true,
    dataHora: false,
    quantidadeCadeiras: true,
    cafe: false,
  },
];

const tipoInativo = {
  nome: 'Tipo Inativo',
  descricao: 'Este tipo não deve ser retornado',
  st_ativo: false,
  dataHora: true,
  quantidadeCadeiras: true,
  cafe: true,
};

describe('Teste de Integracao - Busca de Tipos de Solicitação Ativa', () => {

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste para garantir um ambiente limpo.
    await prisma.tipoSolicitacao.deleteMany();
  });

  afterAll(async () => {
    // Fecha a conexão do prisma após todos os testes.
    await prisma.$disconnect();
  });

 
  it('deve retornar apenas tipos de solicitacao com st_ativo como true', async () => {

    await prisma.tipoSolicitacao.createMany({
      data: [...tiposAtivos, tipoInativo],
    });


    const response = await request(app)
      .get('/solicitacao/buscaTipoSolicitacoesAtiva')
      .expect(200);

    // Verifica se a resposta contém o array de dados e se tem o tamanho correto.
    expect(response.body).toHaveProperty('tipoExistente');
    expect(response.body.tipoExistente).toHaveLength(tiposAtivos.length);

    const tiposRetornados = response.body.tipoExistente;

    // Verifica a estrutura e o conteúdo do primeiro tipo retornado.
    expect(tiposRetornados[0]).toHaveProperty('id');
    expect(tiposRetornados[0].nome).toBe(tiposAtivos[0].nome);
    expect(tiposRetornados[0].st_ativo).toBe(true);
    expect(tiposRetornados[0].front).toEqual({
      tipo: 'Reuniao',
      campos: [
        { nome: 'dataHora', label: 'Data e hora', tipo: 'dateHora' },
        { nome: 'servirCafe', label: 'Servir café', tipo: 'checkbox', opcoes: ['Sim', 'Não'] },
        { nome: 'quantidadeCadeiras', label: 'Quantidade de cadeiras', tipo: 'text' },
      ],
    });

    // Verifica a estrutura e o conteúdo do segundo tipo retornado.
    expect(tiposRetornados[1]).toHaveProperty('id');
    expect(tiposRetornados[1].nome).toBe(tiposAtivos[1].nome);
    expect(tiposRetornados[1].st_ativo).toBe(true);
    expect(tiposRetornados[1].front).toEqual({
      tipo: 'Manutencao',
      campos: [
        { nome: 'quantidadeCadeiras', label: 'Quantidade de cadeiras', tipo: 'text' },
      ],
    });
  });

  it('deve retornar um array vazio se não houver tipos de solicitacao ativos', async () => {

    // Cria um tipo inativo para garantir que o filtro funciona
    await prisma.tipoSolicitacao.create({
      data: tipoInativo,
    });

    const response = await request(app)
      .get('/solicitacao/buscaTipoSolicitacoesAtiva')
      .expect(200);

    // Verifica se a resposta contém um array vazio.
    expect(response.body).toHaveProperty('tipoExistente');
    expect(response.body.tipoExistente).toEqual([]);
  });
});