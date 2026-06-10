import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /apagaSolicitacaoFilha/{id}:
 *   delete:
 *     summary: Deleta uma solicitação filha pelo ID
 *     tags:
 *       - Solicitações
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da solicitação que será deletada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitação deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitação deletada com sucesso
 *       400:
 *         description: ID da solicitação inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID da solicitação inválido
 *       404:
 *         description: Solicitação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Solicitação não encontrada
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


const apagaSolicitacaoFilha = Router();


apagaSolicitacaoFilha.delete("/apagaSolicitacaoFilha/:id", async (req: Request, res: Response) => {
    try {
        const solicitacaoId = parseInt(req.params.id);

        // Validação de ID
        if (isNaN(solicitacaoId)) {
            return res.status(400).json({ error: "ID da solicitação inválido" });
        }

        const chamadoExistente = await prisma.chamado.findUnique({
            where: { id: solicitacaoId },
        });

        if (!chamadoExistente) {
            return res.status(404).json({ error: "Solicitação não encontrada" });
        }

        await prisma.chamado.delete({
            where: { id: solicitacaoId },
        });

        return res.status(200).json({ message: "Solicitação deletada com sucesso" });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});

export default apagaSolicitacaoFilha;
