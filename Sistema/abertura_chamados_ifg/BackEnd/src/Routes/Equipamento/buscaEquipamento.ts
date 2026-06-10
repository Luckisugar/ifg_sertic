import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /buscaEquipamentos:
 *   get:
 *     summary: Retorna todos os equipamentos cadastrados
 *     tags:
 *       - Equipamento
 *     responses:
 *       200:
 *         description: Lista de equipamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipamentoExistente:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Notebook Dell"
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

const buscaEquipRouter = Router();

buscaEquipRouter.get("/buscaEquipamentos", async (req: Request, res: Response) => {
  try {

    const equipamentoExistente = await prisma.equipamento.findMany({});

    return res.status(200).json({
      equipamentoExistente

    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
    }
  }
});

export default buscaEquipRouter;