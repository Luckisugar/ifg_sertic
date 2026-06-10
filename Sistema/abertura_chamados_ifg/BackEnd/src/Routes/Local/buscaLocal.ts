import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /buscaLocais:
 *   get:
 *     summary: Retorna todos os locais cadastrados
 *     tags:
 *       - Local
 *     responses:
 *       200:
 *         description: Lista de locais retornada com sucesso
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

const buscaLocRouter = Router();

buscaLocRouter.get("/buscaLocais", async (req: Request, res: Response) => {
  try {
    const localExistente = await prisma.local.findMany({});
    
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
export default buscaLocRouter;