import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /atualizaLocal:
 *   put:
 *     summary: Atualiza o status (ativo/inativo) de um local
 *     tags:
 *       - Local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarLocalInput'
 *     responses:
 *       200:
 *         description: Local atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *       400:
 *         description: Erro na requisição (dados inválidos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
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
 *
 * components:
 *   schemas:
 *     AtualizarLocalInput:
 *       type: object
 *       required:
 *         - id
 *         - st_ativo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do local
 *           example: 5
 *         st_ativo:
 *           type: boolean
 *           description: Novo status do local (ativo ou inativo)
 *           example: true
 */

const atualizaLocRouter = Router();

atualizaLocRouter.put("/atualizaLocal", async (req: Request, res: Response) => {
  try {
    const { id, st_ativo } = req.body;

    if (!id || typeof st_ativo !== "boolean") {
      return res.status(400).json({ message: "ID e status são obrigatórios" });
    }

     await prisma.local.update({
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

export default atualizaLocRouter;