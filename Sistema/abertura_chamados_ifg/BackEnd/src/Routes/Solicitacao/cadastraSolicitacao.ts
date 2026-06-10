// Routes/cadastroLocal.ts
import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { solicitacaoSchema } from "../../schemas/cadastraSolicitacaoSchema";
import { z } from "zod";



/**
 * @swagger
 * /cadastraSolicitacao:
 *   post:
 *     summary: Cadastra uma nova solicitação de chamado
 *     tags:
 *       - Solicitações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroSolicitacaoInput'
 *     responses:
 *       201:
 *         description: Solicitação cadastrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitação cadastrada com sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Dados inválidos fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro de validação"
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
 *     CadastroSolicitacaoInput:
 *       type: object
 *       required:
 *         - tipoSolicitacaoId
 *         - solicitanteId
 *         - localId
 *         - descricao
 *         - assunto
 *         - status
 *       properties:
 *         tipoSolicitacaoId:
 *           type: integer
 *           example: 1
 *         solicitanteId:
 *           type: integer
 *           example: 1
 *         localId:
 *           type: integer
 *           example: 1
 *         equipamentoId:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         chamadoPaiId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         descricao:
 *           type: string
 *           example: "Problema na iluminação da sala"
 *         assunto:
 *           type: string
 *           example: "Iluminação"
 *         status:
 *           type: string
 *           example: "NOVO"
 *         observacao:
 *           type: string
 *           nullable: true
 *           example: "Precisa resolver antes da aula"
 *         cafe:
 *           type: boolean
 *           nullable: true
 *           example: false
 *         dataHora:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-04-29T14:30:00.000Z"
 *         quantidadeCadeiras:
 *           type: integer
 *           nullable: true
 *           example: 4
 */


const cadastraSolicitacaoRouter = Router();

cadastraSolicitacaoRouter.post("/cadastraSolicitacao", async (req: Request, res: Response) => {
  try {
    const validatedData = solicitacaoSchema.parse(req.body);
    const { tipoSolicitacaoId,solicitanteId,localId,equipamentoId,descricao,assunto,status,observacao,chamadoPaiId,cafe,dataHora,quantidadeCadeiras} = validatedData;

    const solicitacao = await prisma.chamado.create({
        data: {
          tipoSolicitacaoId,
          solicitanteId,
          localId,
          equipamentoId: equipamentoId ?? null,
          descricao,
          assunto,
          status,
          observacao: observacao ?? null,
          chamadoPaiId: chamadoPaiId ?? null,
          cafe: cafe ?? null,
          dataHora: dataHora ? new Date(dataHora) : null,
          quantidadeCadeiras: quantidadeCadeiras ?? null
        }
      });
      

    return res.status(201).json({
      message: "Solicitação cadastrada com sucesso",
      id: solicitacao.id,

    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors[0]?.message || "Erro de validação",
      
      });
    }

    
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default cadastraSolicitacaoRouter;
