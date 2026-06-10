import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /enviaSolicitacaoEncarregada:
 *   put:
 *     summary: Envia um chamado para a encarregada responsável
 *     description: Atualiza o campo `enviadoEncarregada` de um chamado existente para `true`, marcando que ele foi encaminhado à encarregada.
 *     tags:
 *       - Chamados
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chamado que será enviado para a encarregada.
 *     responses:
 *       200:
 *         description: Chamado enviado com sucesso para a encarregada.
 *         content:
 *           application/json:
 *             example:
 *               message: Chamado enviado para a encarregada!
 *       400:
 *         description: Erro de requisição — ID inválido ou erro inesperado.
 *         content:
 *           application/json:
 *             examples:
 *               idInvalido:
 *                 summary: ID inválido
 *                 value:
 *                   error: "ID inválido"
 *               erroDesconhecido:
 *                 summary: Erro desconhecido
 *                 value:
 *                   error: "Ocorreu um erro desconhecido contate o administrador"
 *       404:
 *         description: Chamado não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "Chamado não encontrado"
 */

const enviaSolicitacaoEncarregada = Router();


enviaSolicitacaoEncarregada.put("/enviaSolicitacaoEncarregada", async (req: Request, res: Response) => {
    const chamado_id = req.query.id ? parseInt(req.query.id as string) : NaN;

    if (isNaN(chamado_id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const chamado = await prisma.chamado.findUnique({
            where: { id: chamado_id },
        });

        if (!chamado) {
            return res.status(404).json({ error: "Chamado não encontrado" });
        }

        await prisma.chamado.update({
            where: { id: chamado_id },
            data: { enviadoEncarregada: true },
        });


        return res.status(200).json({message: "Chamado enviado para a encarregada!"});
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
        }
    }
});

export default enviaSolicitacaoEncarregada;
