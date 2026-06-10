// Importa o Supertest para simular requisições HTTP na rota
import request from "supertest";

// Importa o Express para montar uma app temporária para os testes
import express from "express";

// Importa a rota que você quer testar
import cadastraEquipRouter from "../../Routes/Equipamento/cadastraEquipamento";

// Aqui é onde  faz o MOCK do prisma original
// O caminho passado para o jest.mock precisa ser o MESMO do import no código real (ex: '../../lib/prisma')
// Isso garante que quando o código da rota usar `import prisma from '../../lib/prisma'`, ele receba esse mock abaixo
jest.mock("../../lib/prisma", () => ({
  __esModule: true, // necessário para suportar export default corretamente
  default: {
    equipamento: {
      findFirst: jest.fn(), // mock da função findFirst
      update: jest.fn(),    // mock da função update
      create: jest.fn(),    // mock da função create
    },
  },
}));

// Importa o mock que você acabou de definir acima
// Agora você pode controlar os retornos do mock dentro dos testes (ex: mockResolvedValue)
import mockPrisma from "../../lib/prisma";

// Cria um app Express temporário para testar a rota de forma isolada
const app = express();
app.use(express.json());          // Middleware para interpretar JSON
app.use(cadastraEquipRouter);    // Usa a rota que você está testando

// Começa a suite de testes para o endpoint POST /cadastraEquipamento
describe("POST /cadastraEquipamento", () => {
  // Limpa todos os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Testa o caso de cadastrar um novo equipamento que ainda não existe
  it("deve cadastrar um novo equipamento", async () => {
    // Configura o mock para simular que o equipamento ainda não existe
    //Aqui você diz: "Finja que não existe nenhum equipamento com esse nome ainda".
    //Isso simula o comportamento de prisma.equipamento.findFirst retornando null
    (mockPrisma.equipamento.findFirst as jest.Mock).mockResolvedValue(null);

    // Configura o mock para simular a criação bem-sucedida
    (mockPrisma.equipamento.create as jest.Mock).mockResolvedValue({
      id: 1,
      nome: "Notebook Dell",
      st_ativo: true,
    });

    // Faz a requisição POST simulada
    const res = await request(app)
      .post("/cadastraEquipamento")
      .send({ nome: "Notebook Dell" });

    // Verifica se a resposta está correta
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Equipamento cadastrado com sucesso",
      id: 1,
      nome: "Notebook Dell",
      status: true,
    });

    // Verifica se os métodos do mock foram chamados com os parâmetros certos
    //Verifica se sua rota usou corretamente o findFirst com o parâmetro certo.
    //Isso é um teste de comportamento: garante que o código está consultando o nome corretamente.
    expect(mockPrisma.equipamento.findFirst).toHaveBeenCalledWith({
      where: { nome: "Notebook Dell" },
    });
    expect(mockPrisma.equipamento.create).toHaveBeenCalledWith({
      data: { nome: "Notebook Dell" },
    });
  });

  // Testa o caso de já existir um equipamento ativo com o mesmo nome
  it("deve retornar erro se equipamento já estiver ativo", async () => {
    // Simula que o equipamento já existe e está ativo
    (mockPrisma.equipamento.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      nome: "Notebook Dell",
      st_ativo: true,
    });

    // Envia a requisição
    const res = await request(app)
      .post("/cadastraEquipamento")
      .send({ nome: "Notebook Dell" });

    // Espera um erro 400 com mensagem de já cadastrado
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Equipamento já cadastrado" });
  });

  // Testa o caso de reativar um equipamento inativo
  it("deve reativar um equipamento inativo", async () => {
    // Simula que o equipamento existe, mas está inativo
    (mockPrisma.equipamento.findFirst as jest.Mock).mockResolvedValue({
      id: 2,
      nome: "Notebook Dell",
      st_ativo: false,
    });

    // Simula que o update (reativação) foi feito com sucesso
    (mockPrisma.equipamento.update as jest.Mock).mockResolvedValue({
      id: 2,
      nome: "Notebook Dell",
      st_ativo: true,
    });

    // Faz a requisição POST
    const res = await request(app)
      .post("/cadastraEquipamento")
      .send({ nome: "Notebook Dell" });

    // Verifica se a reativação foi bem-sucedida
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Equipamento cadastrado com sucesso",
      id: 2,
      nome: "Notebook Dell",
      status: true,
    });

    // Verifica se o update foi chamado corretamente
    expect(mockPrisma.equipamento.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { st_ativo: true },
    });
  });

  // Testa o caso de validação Zod com nome vazio
  it("deve retornar erro de validação com nome vazio", async () => {
    const res = await request(app)
      .post("/cadastraEquipamento")
      .send({ nome: "" }); // nome vazio, inválido segundo Zod

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined(); // Espera uma mensagem de erro de validação
  });

    // Testa o caso de erro interno no servidor (por exemplo, falha ao criar no banco)
  it("deve retornar erro 500 se ocorrer um erro inesperado", async () => {
    // Simula que não existe equipamento ainda
    (mockPrisma.equipamento.findFirst as jest.Mock).mockResolvedValue(null);

    // Simula que o create lança um erro inesperado
    (mockPrisma.equipamento.create as jest.Mock).mockRejectedValue(
      new Error("Erro inesperado no banco")
    );

    const res = await request(app)
      .post("/cadastraEquipamento")
      .send({ nome: "Notebook Dell" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro interno do servidor" });
  });

});
