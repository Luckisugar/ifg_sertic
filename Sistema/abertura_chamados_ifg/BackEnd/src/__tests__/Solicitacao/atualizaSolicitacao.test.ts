import request from 'supertest';
import express from 'express';
import atualizaSolicitacao from '../../Routes/Solicitacao/atualizaSolicitacao';



jest.mock("../../lib/prisma", () => {
    const mockPrisma = {
        chamado: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        alteracao: {
            create: jest.fn(),
        },
    };
    return mockPrisma;
});

import prisma from '../../lib/prisma';

const app = express();
app.use(express.json());
app.use(atualizaSolicitacao);

describe("PUT /atualizaSolicitacao", () => {
    const url = "/atualizaSolicitacao";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("deve atualizar uma solicitação com sucesso", async () => {
        (prisma.chamado.findUnique as jest.Mock).mockResolvedValue({ id: 12 });
        (prisma.chamado.update as jest.Mock).mockResolvedValue({});
        (prisma.alteracao.create as jest.Mock).mockResolvedValue({});

        const response = await request(app).put(url).send({
            solicitacaoId: 12,
            status: "FINALIZADO",
            prioridade: "ALTA",
            dataPrevista: "2025-05-02T15:30:00Z",
            responsavelId: 5,
            justificativa: "Alteração solicitada pelo coordenador",
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Solicitação alterada com sucesso" });
    });

    it("deve retornar erro 400 quando os dados são inválidos", async () => {
        const response = await request(app).put(url).send({
            solicitacaoId: 155, // inválido
            status: "FINALIZADO",
            prioridade: "ALTA",
            justificativa: "Teste inválido",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("deve retornar erro 404 quando a solicitação não é encontrada", async () => {
        (prisma.chamado.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).put(url).send({
            solicitacaoId: 99,
            status: "FINALIZADO",
            prioridade: "ALTA",
            justificativa: "justificativa válida com mais de 10 caracteres",
            dataPrevista: null,
            responsavelId: null,
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Solicitação não encontrada" });
    });

    it("deve retornar erro 500 em caso de falha interna", async () => {
        (prisma.chamado.findUnique as jest.Mock).mockRejectedValue(new Error("Erro no banco"));

        const response = await request(app).put(url).send({
            solicitacaoId: 12,
            status: "FINALIZADO",
            prioridade: "ALTA",
            justificativa: "Erro interno simulado",
            dataPrevista: null,
            responsavelId: null,
        });


        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erro interno do servidor" });
    });
});
