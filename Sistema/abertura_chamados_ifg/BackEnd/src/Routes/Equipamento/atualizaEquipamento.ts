import prisma from "../../lib/prisma";
import { Router, Response, Request } from "express";

/**
 * @swagger
 * /atualizaEquipamento:
 *   put:
 *     summary: Atualiza o status de um equipamento
 *     tags:
 *       - Equipamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - st_ativo
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do equipamento
 *                 example: 123
 *               st_ativo:
 *                 type: boolean
 *                 description: Novo status do equipamento (ativo ou inativo)
 *                 example: true
 *     responses:
 *       200:
 *         description: Equipamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 *       400:
 *         description: Erro de validação ou erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID e status são obrigatórios"
 *                 error:
 *                   type: string
 *                   example: "Mensagem de erro específica"
 */

const atulizaEquipRouter = Router();

atulizaEquipRouter.put("/atualizaEquipamento", async (req: Request, res: Response) => {
  try {


    const { id, st_ativo } = req.body;

    if (!id || typeof st_ativo !== "boolean") {
      return res.status(400).json({ message: "ID e status são obrigatórios" });
    }

     await prisma.equipamento.update({
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

export default atulizaEquipRouter;