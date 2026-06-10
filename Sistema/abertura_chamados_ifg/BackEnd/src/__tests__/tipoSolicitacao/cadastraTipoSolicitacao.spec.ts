import request from 'supertest'; // Simula requisições HTTP para a API
import { app } from '../../app';
import prisma from '../../lib/prisma';

// Dados de teste para os diferentes cenários.
// Esses objetos são criados para testar casos de sucesso, reativação e validação.
const tipoSolicitacaoValido = {
  nome: 'Solicitacao de Teste',
  descricao: 'Descrição do tipo de solicitação',
  cafe: false,
  dataHora: false,
  quantidadeCadeiras: false,
};

const tipoSolicitacaoInativo = {
  nome: 'Solicitacao Inativa',
  descricao: 'Descrição de um tipo inativo',
  cafe: true,
  st_ativo: false,
  dataHora: true,
  quantidadeCadeiras: true,
};

const tipoSolicitacaoInvalido = {
  nome: 12345, // Dados inválidos de acordo com o schema do Zod
  descricao: 'Descrição inválida',
  cafe: false,
  dataHora: false,
  quantidadeCadeiras: false,
};

describe('Teste de Integracao - Cadastro de Tipo de Solicitação', () => {

  beforeEach(async () => {
    await prisma.tipoSolicitacao.deleteMany();
  });


  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve cadastrar um novo tipo de solicitacao e retornar status 201', async () => {
    // 1. Simula uma requisição POST para a rota, enviando dados válidos.
    const response = await request(app)
      .post('/solicitacao/cadastraTipoSolicitacao')
      .send(tipoSolicitacaoValido)
      .expect(201);

    // (expect): verificam o corpo da resposta da API.
    // Garante que a mensagem e os dados do tipo de solicitação estão corretos.
    expect(response.body).toHaveProperty('message', 'Tipo de chamado cadastrado com sucesso');
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(tipoSolicitacaoValido.nome);
    expect(response.body.status).toBe(true);

    // Busca o tipo de solicitação recém-criado para confirmar se foi salvo corretamente.
    const tipoSalvo = await prisma.tipoSolicitacao.findUnique({
      where: { id: response.body.id },
    });

    // Asserções no banco de dados.
    // Garante que o item existe e que suas propriedades estão corretas.
    expect(tipoSalvo).toBeDefined();
    expect(tipoSalvo?.nome).toBe(tipoSolicitacaoValido.nome);
    expect(tipoSalvo?.st_ativo).toBe(true);
  });

  // Este teste verifica a lógica de negócio que reativa um item inativo.
  it('deve atualizar um tipo de solicitacao inativo para ativo e retornar status 201', async () => {
    // Cria um tipo de solicitação inativo diretamente no banco de dados para simular o cenário.
    const tipoInativo = await prisma.tipoSolicitacao.create({
      data: tipoSolicitacaoInativo,
    });

    //Tenta cadastrar o mesmo tipo, o que deve reativar ele na API.
    const response = await request(app)
      .post('/solicitacao/cadastraTipoSolicitacao')
      .send({
        nome: tipoInativo.nome,
        descricao: tipoInativo.descricao,
        cafe: tipoInativo.cafe,
        dataHora: tipoInativo.dataHora,
        quantidadeCadeiras: tipoInativo.quantidadeCadeiras,
      })
      .expect(201);

    //Verifica a resposta da API para confirmar a reativação.
    expect(response.body).toHaveProperty('message', 'solicitação cadastrado com sucesso');
    expect(response.body).toHaveProperty('id', tipoInativo.id);
    expect(response.body.nome).toBe(tipoInativo.nome);
    expect(response.body.status).toBe(true);

    //Verificação final no banco de dados para confirmar a mudança de status.
    const tipoAtualizado = await prisma.tipoSolicitacao.findUnique({
      where: { id: tipoInativo.id },
    });
    expect(tipoAtualizado?.st_ativo).toBe(true);
  });

  // Este teste valida a lógica de prevenção de duplicidade.
  it('não deve cadastrar um tipo de solicitacao já ativo e retornar status 400', async () => {
    //Cria um tipo de solicitação ativo no banco para simular a existência.
    await prisma.tipoSolicitacao.create({
      data: tipoSolicitacaoValido,
    });

    //Tenta cadastrar o mesmo tipo, esperando que a API retorne um erro.
    const response = await request(app)
      .post('/solicitacao/cadastraTipoSolicitacao')
      .send(tipoSolicitacaoValido)
      .expect(400); // 400 (Bad Request) é esperado para dados inválidos ou duplicados.

    //Verifica se a mensagem de erro está correta.
    expect(response.body).toHaveProperty('error', 'Tipo de solicitação já cadastrado');
  });

  // Este teste garante que o Zod está validando os dados corretamente.
  it('não deve cadastrar um tipo de solicitacao com dados inválidos e retornar status 400', async () => {
    //Envia uma requisição com um objeto que não corresponde ao schema do Zod.
    const response = await request(app)
      .post('/solicitacao/cadastraTipoSolicitacao')
      .send(tipoSolicitacaoInvalido)
      .expect(400);

    //Verifica se a resposta contém uma propriedade de erro e se o tipo está correto.
    expect(response.body).toHaveProperty('error');
    expect(typeof response.body.error).toBe('string');
  });
});