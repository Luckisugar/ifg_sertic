import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /apagaSolicitacaoRascunho/{id}:
 *   delete:
 *     summary: Deleta uma solicitação  pelo ID, somente se estiver em RASCUNHO
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
 *       400:
 *         description: ID inválido ou solicitação não está em RASCUNHO
 *       404:
 *         description: Solicitação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

const apagaSolicitacaoRascunho = Router();

apagaSolicitacaoRascunho.delete("/apagaSolicitacaoRascunho/:id", async (req: Request, res: Response) => {
    try {
        const solicitacaoId = parseInt(req.params.id);

        // Validação de ID
        if (isNaN(solicitacaoId)) {
            return res.status(400).json({ error: "ID da solicitação inválido" });
        }

        // Busca o chamado
        const chamadoExistente = await prisma.chamado.findUnique({
            where: { id: solicitacaoId },
        });

        if (!chamadoExistente) {
            return res.status(404).json({ error: "Solicitação não encontrada" });
        }

        // Verifica se está em RASCUNHO
        if (chamadoExistente.status !== "RASCUNHO") {
            return res.status(400).json({ error: "Só é permitido apagar solicitações em RASCUNHO" });
        }

        // Deleta se for rascunho
        await prisma.chamado.delete({
            where: { id: solicitacaoId },
        });

        return res.status(200).json({ message: "Solicitação deletada com sucesso" });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});

export default apagaSolicitacaoRascunho;
