import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /buscaEquipamentosAtivo:
 * get:
 * summary: Retorna todos os equipamentos ativos cadastrados
 * tags:
 * - Equipamento
 * responses:
 * 200:
 * description: Lista de equipamentos ativos retornada com sucesso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * equipamentoExistente: # Nome da chave que encapsula o array, conforme o código
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * example: 1
 * nome:
 * type: string
 * example: "Notebook Dell"
 * st_ativo:
 * type: boolean
 * example: true
 * 400:
 * description: Erro na requisição
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: "Ocorreu um erro desconhecido contate o administrador"
 */

const buscaEquipAtivoRouter = Router();

buscaEquipAtivoRouter.get("/buscaEquipamentosAtivo", async (req: Request, res: Response) => {
  try {

    const equipamentoExistente = await prisma.equipamento.findMany({
      where: {
        st_ativo: true
      }
    });

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

export default buscaEquipAtivoRouter;