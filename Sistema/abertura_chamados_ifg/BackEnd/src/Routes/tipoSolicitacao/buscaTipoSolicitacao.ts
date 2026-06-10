import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Tipos de Solicitação
 *   description: Gerenciamento de tipos de solicitação

 * /buscaTipoSolicitacoes:
 *   get:
 *     summary: Buscar todos os tipos de solicitação
 *     tags: [Tipos de Solicitação]
 *     responses:
 *       200:
 *         description: Lista de tipos de solicitação retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoExistente:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Manutenção"
 *                       st_ativo:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Erro ao buscar os tipos de solicitação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar tipos de solicitação"
 */

const buscaTipoSolRouter = Router();


buscaTipoSolRouter.get("/buscaTipoSolicitacoes", async (req: Request, res: Response) => {
  try {

    const tipoExistente = await prisma.tipoSolicitacao.findMany({});
  
    return res.status(200).json({
      tipoExistente
      
    });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
      }

    
  }
});

export default buscaTipoSolRouter;
