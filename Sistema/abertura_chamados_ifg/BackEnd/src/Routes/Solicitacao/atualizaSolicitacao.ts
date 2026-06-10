import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { alteraSolicitacaoSchema } from "../../schemas/alteraSolicitacaoSchema";
import { z } from "zod";

/**
 * @swagger
 * /atualizaSolicitacao:
 *   put:
 *     summary: Atualiza os dados de uma solicitação existente
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
 *             properties:
 *               solicitacaoId:
 *                 type: integer
 *                 description: ID da solicitação a ser atualizada
 *                 example: 42
 *               status:
 *                 type: string
 *                 description: "Novo status da solicitação (exemplo: EM_ANDAMENTO, CANCELADO, CONCLUÍDO)"
 *                 example: "CANCELADO"
 *               prioridade:
 *                 type: string
 *                 description: Nova prioridade da solicitação
 *                 example: "Alta"
 *               dataPrevista:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data prevista de conclusão
 *                 example: "2025-11-30T12:00:00Z"
 *               responsavel:
 *                 type: string
 *                 description: Nome do responsável pela solicitação
 *                 example: "Maria Souza"
 *               justificativa:
 *                 type: string
 *                 description: Justificativa da alteração, especialmente usada em cancelamentos
 *                 example: "Cancelado por duplicidade de registro"
 *     responses:
 *       200:
 *         description: Solicitação alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitação alterada com sucesso"
 *       400:
 *         description: Erro de validação (dados inválidos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "O campo 'status' é obrigatório"
 *       404:
 *         description: Solicitação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Solicitação não encontrada"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

const alteraSolicitacao = Router();

// Define tipo local para evitar importação de Prisma.*
type AtualizacaoChamadoInput = {
  status?: string;
  prioridadeAtual?: string;
  dataPrevistaAtual?: Date;
  responsavel?: string;
};

alteraSolicitacao.put("/atualizaSolicitacao", async (req: Request, res: Response) => {
  try {
    const data = alteraSolicitacaoSchema.parse(req.body);
    const { solicitacaoId, status, prioridade, dataPrevista, responsavel, justificativa } = data;

    const chamadoExistente = await prisma.chamado.findUnique({
      where: { id: solicitacaoId },
    });

    if (!chamadoExistente) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    const atualizacaoChamado: Partial<AtualizacaoChamadoInput> = {};
    if (status !== null) atualizacaoChamado.status = status;
    if (prioridade !== null) atualizacaoChamado.prioridadeAtual = prioridade;
    if (dataPrevista !== null) atualizacaoChamado.dataPrevistaAtual = new Date(dataPrevista);
    if (responsavel !== null) atualizacaoChamado.responsavel = responsavel;

    if (Object.keys(atualizacaoChamado).length > 0) {
      await prisma.chamado.update({
        where: { id: solicitacaoId },
        data: atualizacaoChamado,
      });
    }

    if (status === "CANCELADO") {
      await prisma.alteracao.create({
        data: {
          chamado: { connect: { id: solicitacaoId } },
          status,
          prioridade,
          dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
          justificativa: justificativa || "Cancelado pela Encarregada",
          responsavel,
        },
      });
    }

    return res.status(200).json({ message: "Solicitação alterada com sucesso" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }

    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default alteraSolicitacao;
