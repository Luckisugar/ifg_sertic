import { Router } from "express";
import prisma from "../../lib/prisma";
import { updateChamadoStatusSchema } from "../../schemas/atualizaStatusSolicitacaoSchema";

/**
 * @swagger
 * /atualizaStatus:
 *   put:
 *     summary: Atualiza o status de um chamado existente
 *     description: Permite que um usuário atualize o status de uma solicitação (chamado) específica.
 *     tags:
 *       - Solicitações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chamado_id
 *               - status
 *             properties:
 *               chamado_id:
 *                 type: integer
 *                 description: ID do chamado a ser atualizado
 *                 example: 15
 *               status:
 *                 type: string
 *                 description: "Novo status do chamado (exemplo: EM_ANDAMENTO, CONCLUÍDO, CANCELADO)"
 *                 example: "CONCLUÍDO"
 *     responses:
 *       200:
 *         description: Status do chamado atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Status do chamado atualizado com sucesso."
 *                 chamado:
 *                   type: object
 *                   description: Dados do chamado após a atualização
 *                   example:
 *                     id: 15
 *                     status: "CONCLUÍDO"
 *                     prioridadeAtual: "Média"
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
 *                   example: "Erro de validação"
 *                 detalhes:
 *                   type: array
 *                   description: Detalhes do erro de validação do Zod
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["status"]
 *                       message:
 *                         type: string
 *                         example: "Status é obrigatório"
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

const updateStatusRouter = Router();

updateStatusRouter.put("/atualizaStatus", async (req, res) => {
  try {
    // Valida entrada com Zod
    const { chamado_id, status } = updateChamadoStatusSchema.parse(req.body);

    // Verifica se o chamado existe
    const chamado = await prisma.chamado.findUnique({
      where: { id: chamado_id },
    });

    if (!chamado) {
      return res.status(404).json({ error: "Chamado não encontrado" });
    }

    // Atualiza o status
    const chamadoAtualizado = await prisma.chamado.update({
      where: { id: chamado_id },
      data: { status },
    });

    return res.status(200).json({
      message: "Status do chamado atualizado com sucesso.",
      chamado: chamadoAtualizado,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Erro de validação",
        detalhes: error.errors,
      });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default updateStatusRouter;
