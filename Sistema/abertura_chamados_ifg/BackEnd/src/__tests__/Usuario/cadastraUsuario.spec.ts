import request from 'supertest';
import { app } from '../../app'; 
import prisma from '../../lib/prisma'; 

// --- Dados de Teste ---
const usuarioValido = {
  nome: 'Teste Integracao',
  matricula: '987654321321',
  email: 'testeintegracao@email.com',
  tipoUsuario: 'ADMIN',
};

const usuarioComMatriculaExistente = {
  nome: 'Outro Usuario',
  matricula: '987654321321', // Mesma matrícula do usuário válido
  email: 'outroteste@email.com',
  tipoUsuario: 'ADMIN',
};

const usuarioComDadosInvalidos = {
  nome: 'Nome Curto',
  matricula: '1234', // Matrícula muito curta para a validação
  email: 'emailinvalido', // Email sem formato válido
  tipoUsuario: 'INVALIDO',
};

// --- Estrutura do Teste ---
describe('Teste de Integracao - Cadastro de Usuário', () => {
  // Limpa o banco de dados antes de cada teste para garantir um estado inicial limpo.
  beforeEach(async () => {
    await prisma.usuario.deleteMany();
  });

  // Fecha a conexão com o banco de dados após a execução de todos os testes.
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Caso 1: Criação de Usuário com Sucesso ---
  it('deve cadastrar um novo usuário e retornar status 201', async () => {
    // 1. Envia uma requisição POST com dados válidos.
    const response = await request(app)
      .post('/usuario/cadastraUsuario')
      .send(usuarioValido)
      .expect(201);

    // 2. Verifica a estrutura da resposta da API.
    expect(response.body).toHaveProperty('message', 'Usuário cadastrado com sucesso');
    expect(response.body).toHaveProperty('usuario');

    const novoUsuario = response.body.usuario;

    // 3. Verifica se os dados do usuário na resposta estão corretos.
    expect(novoUsuario).toHaveProperty('id');
    expect(novoUsuario.nome).toBe(usuarioValido.nome);
    expect(novoUsuario.matricula).toBe(usuarioValido.matricula);
    expect(novoUsuario.email).toBe(usuarioValido.email);
    expect(novoUsuario.tipoUsuario).toBe(usuarioValido.tipoUsuario);

    // 4. Verifica se o usuário foi realmente salvo no banco de dados.
    const usuarioSalvo = await prisma.usuario.findFirst({
      where: { email: usuarioValido.email },
    });

    // 5. Confirma a existência e a consistência dos dados salvos.
    expect(usuarioSalvo).toBeDefined();
    expect(usuarioSalvo?.nome).toBe(usuarioValido.nome);
    expect(usuarioSalvo?.email).toBe(usuarioValido.email);
    expect(usuarioSalvo?.senha).toBeDefined();
  }, 10000);

  // --- Caso 2: Matrícula Já Cadastrada ---
  it('não deve cadastrar um usuário com matrícula já existente e retornar status 400', async () => {
    // Primeiro, cadastra um usuário para simular a existência da matrícula.
    await request(app)
      .post('/usuario/cadastraUsuario')
      .send(usuarioValido);

    // Tenta cadastrar um novo usuário com a mesma matrícula.
    const response = await request(app)
      .post('/usuario/cadastraUsuario')
      .send(usuarioComMatriculaExistente)
      .expect(400);

    // Verifica se a resposta de erro está correta.
    expect(response.body).toHaveProperty('error', 'Matrícula já cadastrada');
  }, 10000);

  // --- Caso 3: Dados Inválidos (`ZodError`) ---
  it('não deve cadastrar um usuário com dados inválidos e retornar status 400', async () => {
    // Envia uma requisição com dados que não passam na validação do Zod.
    const response = await request(app)
      .post('/usuario/cadastraUsuario')
      .send(usuarioComDadosInvalidos)
      .expect(400);

    // Verifica se a resposta de erro contém a mensagem de validação do Zod.
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBeDefined();
  });
});
