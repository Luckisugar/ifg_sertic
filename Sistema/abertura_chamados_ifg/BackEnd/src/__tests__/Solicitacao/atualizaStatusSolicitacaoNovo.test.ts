import request from 'supertest';
import express from 'express';
import atualizaStatusSolicitacaoNovo from '../../Routes/Solicitacao/atualizaStatusSolicitacaoNovo';

jest.mock("../../lib/prisma", () => ({
    chamado: {
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
    },
}));

import prisma from '../../lib/prisma';

const app = express();
app.use(express.json());
app.use(atualizaStatusSolicitacaoNovo);

describe("PUT /atualizaStatusSolicitacaoNovo", () => {
    const url = "/atualizaStatusSolicitacaoNovo";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("deve atualizar o status do chamado pai e filhos para 'NOVO'", async () => {
        /*
        1. prisma.chamado.updateMany
        Essa é a função do Prisma usada para atualizar múltiplos registros no banco de dados. No seu código real, ela está sendo usada para atualizar o status de todos os chamados filhos do chamado pai.
    
    2. as jest.Mock
    Estamos dizendo ao TypeScript que estamos tratando essa função como um mock do Jest. Isso permite que a gente defina como essa função deve se comportar nos testes (ou seja, simular um retorno).
    
    3. .mockResolvedValue({ count: 2 })
    Significa que, quando updateMany for chamado no teste, ele vai simular a resposta como se tivesse atualizado 2 registros no banco de dados — por isso o objeto { count: 2 }.
    
    */
        (prisma.chamado.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
        (prisma.chamado.update as jest.Mock).mockResolvedValue({ id: 1, status: "NOVO" });
        (prisma.chamado.updateMany as jest.Mock).mockResolvedValue({ count: 2 });

        const response = await request(app).put(url).send({ chamadoPaiId: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Status atualizado para 'Novo' no chamado pai e seus filhos",
        });
    });

    it("deve retornar 400 se o ID do chamado pai for inválido", async () => {
        const response = await request(app).put(url).send({ chamadoPaiId: "abc" });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "ID do chamado pai inválido" });
    });

    it("deve retornar 404 se o chamado pai não for encontrado", async () => {
        (prisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).put(url).send({ chamadoPaiId: 999 });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Chamado pai não encontrado" });
    });

    it("deve retornar 500 em caso de erro interno", async () => {
        (prisma.chamado.findUnique as jest.Mock).mockRejectedValue(new Error("Erro simulado"));

        const response = await request(app).put(url).send({ chamadoPaiId: 1 });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erro interno do servidor" });
    });
});
