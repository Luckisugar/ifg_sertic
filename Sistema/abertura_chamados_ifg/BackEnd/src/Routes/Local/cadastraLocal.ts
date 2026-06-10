// Routes/cadastroLocal.ts
import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { localSchema } from "../../schemas/cadastraLocalSchema";
import { z } from "zod";

/**
 * @swagger
 * /cadastraLocal:
 *   post:
 *     summary: Cadastra um novo local ou reativa um local inativo
 *     tags: 
 *      - Local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroLocalInput'
 *     responses:
 *       201:
 *         description: Local cadastrado ou reativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Local cadastrado com sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Biblioteca Central"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dados inválidos ou local já existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Local já cadastrado"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
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

 * components:
 *   schemas:
 *     CadastroLocalInput:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do local a ser cadastrado
 *           example: "Biblioteca Central"
 */

const cadastraLocRouter = Router();

cadastraLocRouter.post("/cadastraLocal", async (req: Request, res: Response) => {
  try {
    const validatedData = localSchema.parse(req.body);
    const { nome } = validatedData;

    const localExistente = await prisma.local.findFirst({
      where: { nome },
    });

    if (localExistente) {
      if (localExistente.st_ativo) {
        return res.status(400).json({ error: "Local já cadastrado" });
      } else {
        const atualizado = await prisma.local.update({
          where: { id: localExistente.id },
          data: { st_ativo: true },
        });

        return res.status(201).json({
          message: "Local cadastrado com sucesso",
          id: atualizado.id,
          nome: atualizado.nome,
          status: atualizado.st_ativo,
        });
      }
    }

    const novoLocal = await prisma.local.create({
      data: { nome },
    });

    return res.status(201).json({
      message: "Local cadastrado com sucesso",
      id: novoLocal.id,
      nome: novoLocal.nome,
      status: novoLocal.st_ativo,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors[0]?.message || "Erro de validação",
      
      });
    }

    console.error("Erro ao cadastrar local:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default cadastraLocRouter;
