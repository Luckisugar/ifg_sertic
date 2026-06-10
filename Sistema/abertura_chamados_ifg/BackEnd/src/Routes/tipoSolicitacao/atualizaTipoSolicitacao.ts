import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Tipos de Solicitação
 *   description: Gerenciamento de tipos de solicitação

 * /atualizaTipoSolicitacao:
 *   put:
 *     summary: Atualiza o status de um tipo de solicitação (ativo ou inativo)
 *     tags: [Tipos de Solicitação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarTipoSolicitacaoInput'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: ID e status obrigatórios ou erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID e status são obrigatórios"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ocorreu um erro desconhecido contate o administrador"

 * components:
 *   schemas:
 *     AtualizarTipoSolicitacaoInput:
 *       type: object
 *       required:
 *         - id
 *         - st_ativo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do tipo de solicitação a ser atualizado
 *           example: 1
 *         st_ativo:
 *           type: boolean
 *           description: Novo status (true para ativo, false para inativo)
 *           example: true
 */

const atualizaTipoSolRouter = Router();

atualizaTipoSolRouter.put("/atualizaTipoSolicitacao", async (req: Request, res: Response) => {
  try {


    const { id, st_ativo } = req.body;

    if (!id || typeof st_ativo !== "boolean") {
      return res.status(400).json({ message: "ID e status são obrigatórios" });
    }

     await prisma.tipoSolicitacao.update({
      where: { id },
      data: { st_ativo },
    });

    return res.status(200).json({
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
      }

    
  }
});

export default atualizaTipoSolRouter;
