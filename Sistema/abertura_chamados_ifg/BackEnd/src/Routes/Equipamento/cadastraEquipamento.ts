import prisma from "../../lib/prisma";
import { equipamentoSchema } from "../../schemas/cadastraEquipamentoSchema";
import { z } from "zod";
import { Response, Request, Router } from "express";

/**
 * @swagger
 * /cadastraEquipamento:
 *   post:
 *     summary: Cadastra um novo equipamento ou reativa um equipamento inativo
 *     tags:
 *       - Equipamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EquipamentoInput'
 *     responses:
 *       201:
 *         description: Equipamento cadastrado ou reativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Equipamento cadastrado com sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Notebook Dell"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dados inválidos ou equipamento já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Equipamento já cadastrado"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Detalhes dos erros de validação (se houver)
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 *
 * components:
 *   schemas:
 *     EquipamentoInput:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do equipamento
 *           example: "Notebook Dell"
 */

const cadastraEquipRouter = Router();

cadastraEquipRouter.post("/cadastraEquipamento", async (req: Request, res: Response) => {
  try {
    const validatedData = equipamentoSchema.parse(req.body);
    const { nome } = validatedData;

    const equipamentoExistente = await prisma.equipamento.findFirst({
      where: { nome },
    });

    if (equipamentoExistente) {
      if (equipamentoExistente.st_ativo) {
        return res.status(400).json({ error: "Equipamento já cadastrado" });
      } else {
        const equipamentoReativado = await prisma.equipamento.update({
          where: { id: equipamentoExistente.id },
          data: { st_ativo: true },
        });

        return res.status(201).json({
          message: "Equipamento cadastrado com sucesso",
          id: equipamentoReativado.id,
          nome: equipamentoReativado.nome,
          status: equipamentoReativado.st_ativo,
        });
      }
    }

    const novoEquipamento = await prisma.equipamento.create({
      data: { nome },
    });

    return res.status(201).json({
      message: "Equipamento cadastrado com sucesso",
      id: novoEquipamento.id,
      nome: novoEquipamento.nome,
      status: novoEquipamento.st_ativo,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors[0]?.message || "Erro de validação",
      });
    }

   // console.error("Erro ao cadastrar equipamento:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default cadastraEquipRouter;