import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /buscaLocalAtivo:
 *   get:
 *     summary: Retorna todos os locais com status ativo
 *     tags:
 *       - Local
 *     responses:
 *       200:
 *         description: Lista de locais ativos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 localExistente:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Auditório Central"
 *                       st_ativo:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Erro na requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ocorreu um erro desconhecido contate o administrador"
 */

const buscaLocAtivoRouter = Router();

buscaLocAtivoRouter.get("/buscaLocalAtivo", async (req: Request, res: Response) => {
  try {
    const localExistente = await prisma.local.findMany({
      where: {
        st_ativo: true
      }
    });

    return res.status(200).json({
      localExistente
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
    }
  }
});

export default buscaLocAtivoRouter;
