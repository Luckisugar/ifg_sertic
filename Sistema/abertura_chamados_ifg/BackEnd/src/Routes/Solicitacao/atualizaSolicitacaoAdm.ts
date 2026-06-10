import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { z } from "zod";
import { solicitacaoAdmSchema } from "../../schemas/atualizaSolicitacaoAdmSchema";

/**
 * @swagger
 * /atualizaSolicitacaoAdm:
 *   put:
 *     summary: Atualiza uma solicitação (chamado) com privilégios administrativos
 *     description: Permite que administradores atualizem dados completos de um chamado, incluindo status, responsável, prioridade e data prevista.
 *     tags:
 *       - Solicitações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chamadoId
 *               - status
 *             properties:
 *               chamadoId:
 *                 type: integer
 *                 description: ID do chamado a ser atualizado
 *                 example: 17
 *               responsavel:
 *                 type: string
 *                 description: Nome do responsável atribuído ao chamado
 *                 example: "Carlos Andrade"
 *               dataPrevista:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data prevista para conclusão
 *                 example: "2025-11-30T12:00:00Z"
 *               prioridade:
 *                 type: string
 *                 description: Nível de prioridade do chamado
 *                 example: "Alta"
 *               status:
 *                 type: string
 *                 description: Novo status do chamado
 *                 example: "CANCELADO"
 *               justificativa:
 *                 type: string
 *                 description: Justificativa da alteração (usada especialmente para cancelamentos)
 *                 example: "Cancelado por motivo administrativo"
 *     responses:
 *       200:
 *         description: Chamado atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chamado atualizado com sucesso"
 *                 chamadoAtualizado:
 *                   type: object
 *                   description: Dados do chamado após a atualização
 *                   example:
 *                     id: 17
 *                     responsavel: "Carlos Andrade"
 *                     status: "CANCELADO"
 *                     prioridadeAtual: "Alta"
 *                     dataPrevistaAtual: "2025-11-30T12:00:00.000Z"
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
 *         description: Chamado não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Chamado não encontrado"
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

const atualizaSolicitacaoRouter = Router();

atualizaSolicitacaoRouter.put("/atualizaSolicitacaoAdm", async (req: Request, res: Response) => {
  try {
    const validatedData = solicitacaoAdmSchema.parse(req.body);
    const { chamadoId, responsavel, dataPrevista, prioridade, status, justificativa } = validatedData;

    const chamadoExistente = await prisma.chamado.findUnique({ where: { id: chamadoId } });

    if (!chamadoExistente) {
      return res.status(404).json({ error: "Chamado não encontrado" });
    }

    const novaDataPrevista = new Date(dataPrevista);

    const chamadoAtualizado = await prisma.chamado.update({
      where: { id: chamadoId },
      data: {
        responsavel,
        dataPrevistaAtual: novaDataPrevista,
        dataPrevistaOriginal: novaDataPrevista,
        prioridadeAtual: prioridade,
        prioridadeOriginal: prioridade,
        status,
      },
    });

    // Cria registro de alteração se status for CANCELADO
    if (status === "CANCELADO") {
      await prisma.alteracao.create({
        data: {
          chamado: { connect: { id: chamadoId } },
          status,
          prioridade,
          dataPrevista: novaDataPrevista,
          justificativa: justificativa || "Cancelado pelo administrador",
          responsavel,
        },
      });
    }

    return res.status(200).json({
      message: "Chamado atualizado com sucesso",
      chamadoAtualizado,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }

    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default atualizaSolicitacaoRouter;
