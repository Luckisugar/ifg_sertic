import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { atualizaSolicitacaoEnviaSchema } from "../../schemas/atualizaSolicitacaoEnviaSchema";
import { z } from "zod";

const atualizaSolicitacaoEnvia = Router();

/**
 * @swagger
 * /solicitacao/atualizar:
 *   put:
 *     summary: Atualiza dados de uma solicitação e também o status do chamado pai e filhos
 *     tags:
 *       - Solicitações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - solicitacaoId
 *               - chamadoPaiId
 *             properties:
 *               solicitacaoId:
 *                 type: integer
 *               chamadoPaiId:
 *                 type: integer
 *               equipamentoId:
 *                 type: integer
 *                 nullable: true
 *               tipoSolicitacaoId:
 *                 type: integer
 *                 nullable: true
 *               localId:
 *                 type: integer
 *                 nullable: true
 *               descricao:
 *                 type: string
 *                 nullable: true
 *               observacao:
 *                 type: string
 *                 nullable: true
 *               assunto:
 *                 type: string
 *                 nullable: true
 *               cafe:
 *                 type: boolean
 *                 nullable: true
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               quantidadeCadeiras:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Solicitação e status atualizados com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Solicitação ou chamado pai não encontrados
 *       500:
 *         description: Erro interno
 */
atualizaSolicitacaoEnvia.put("/atualizaSolicitacaoEnvia", async (req: Request, res: Response) => {
    try {
        // 🔹 Valida entrada para atualização dos dados
        const data = atualizaSolicitacaoEnviaSchema.parse(req.body);
        const { solicitacaoId, equipamentoId, tipoSolicitacaoId, localId, descricao, observacao, assunto, cafe, dataHora, quantidadeCadeiras, chamadoPaiId } = data;

        // ---------- Atualização dos dados ----------
        const chamadoExistente = await prisma.chamado.findUnique({
            where: { id: solicitacaoId },
        });

        if (!chamadoExistente) {
            return res.status(404).json({ error: "Solicitação não encontrada" });
        }

        const atualizacaoChamado: any = {};
        if (equipamentoId !== null) atualizacaoChamado.equipamento = { connect: { id: equipamentoId } };
        if (tipoSolicitacaoId !== null) atualizacaoChamado.tipoSolicitacao = { connect: { id: tipoSolicitacaoId } };
        if (localId !== null) atualizacaoChamado.local = { connect: { id: localId } };
        if (descricao !== null) atualizacaoChamado.descricao = descricao;
        if (observacao !== null) atualizacaoChamado.observacao = observacao;
        if (assunto !== null) atualizacaoChamado.assunto = assunto;
        if (cafe !== null) atualizacaoChamado.cafe = cafe;
        if (dataHora !== null) atualizacaoChamado.dataHora = new Date(dataHora);
        if (quantidadeCadeiras !== null) atualizacaoChamado.quantidadeCadeiras = quantidadeCadeiras;

        if (Object.keys(atualizacaoChamado).length > 0) {
            await prisma.chamado.update({
                where: { id: solicitacaoId },
                data: atualizacaoChamado,
            });
        }

        // ---------- Atualização do status ----------
        if (!chamadoPaiId || isNaN(chamadoPaiId)) {
            return res.status(400).json({ error: "ID do chamado pai inválido" });
        }

        const chamadoPai = await prisma.chamado.findUnique({
            where: { id: chamadoPaiId },
        });

        if (!chamadoPai) {
            return res.status(404).json({ error: "Chamado pai não encontrado" });
        }

        await prisma.chamado.update({
            where: { id: chamadoPaiId },
            data: { status: "NOVO" },
        });

        await prisma.chamado.updateMany({
            where: { chamadoPaiId },
            data: { status: "NOVO" },
        });

        return res.status(200).json({ message: "Solicitação atualizada e status do chamado pai/filhos definido como 'NOVO'" });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0]?.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});

export default atualizaSolicitacaoEnvia;