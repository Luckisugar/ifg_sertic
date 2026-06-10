import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";


/**
 * @swagger
 * /atualizaStatusSolicitacaoNovo:
 *   put:
 *     summary: Atualiza o status de um chamado pai e seus chamados filhos para "NOVO"
 *     tags:
 *       - Solicitações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chamadoPaiId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - chamadoPaiId
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status atualizado para 'Novo' no chamado pai e seus filhos
 *       400:
 *         description: ID do chamado pai inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID do chamado pai inválido
 *       404:
 *         description: Chamado pai não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Chamado pai não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro interno do servidor
 */

const atualizaStatusSolicitacaoNovo = Router();


atualizaStatusSolicitacaoNovo.put("/atualizaStatusSolicitacaoNovo", async (req: Request, res: Response) => {
  try {
    const { chamadoPaiId } = req.body;

    if (!chamadoPaiId || isNaN(chamadoPaiId)) {
      return res.status(400).json({ error: "ID do chamado pai inválido" });
    }

    // Verifica se o chamado pai existe
    const chamadoPai = await prisma.chamado.findUnique({
      where: { id: chamadoPaiId },
    });

    if (!chamadoPai) {
      return res.status(404).json({ error: "Chamado pai não encontrado" });
    }

    // Atualiza o status do chamado pai
    await prisma.chamado.update({
      where: { id: chamadoPaiId },
      data: { status: "NOVO" },
    });

    // Atualiza o status dos chamados filhos
    await prisma.chamado.updateMany({
      where: { chamadoPaiId },
      data: { status: "NOVO" },
    });

    return res.status(200).json({ message: "Status atualizado para 'Novo' no chamado pai e seus filhos" });

  } catch (error) {
    
    return res.status(500).json({ error: "Erro interno do servidor" },);
  }
});

export default atualizaStatusSolicitacaoNovo;
