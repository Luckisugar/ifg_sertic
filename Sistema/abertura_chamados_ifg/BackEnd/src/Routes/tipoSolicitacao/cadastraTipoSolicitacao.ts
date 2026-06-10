import prisma from "../../lib/prisma";
import { tipoSolicitacaoSchema } from "../../schemas/cadastraTipoSolicitacaoSchema";
import { z } from "zod";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Tipos de Solicitação
 *   description: Gerenciamento de tipos de solicitação

 * /cadastraTipoSolicitacao:
 *   post:
 *     summary: Cadastrar um novo tipo de solicitação
 *     tags: [Tipos de Solicitação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *               - dataHora
 *               - quantidadeCadeiras
 *               - cafe
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Reunião"
 *               descricao:
 *                 type: string
 *                 example: "Solicitação para reunião mensal"
 *               dataHora:
 *                 type: boolean
 *                 example: true
 *               quantidadeCadeiras:
 *                 type: integer
 *                 example: 20
 *               cafe:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tipo de solicitação criado ou reativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de chamado cadastrado com sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Reunião"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Erro de validação ou tipo de solicitação já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tipo de solicitação já cadastrado"
 *       500:
 *         description: Erro interno do servidor
 */

const cadastraTipoSolRouter = Router();


cadastraTipoSolRouter.post("/cadastraTipoSolicitacao", async (req: Request, res: Response) => {
  try {
    const validatedData = tipoSolicitacaoSchema.parse(req.body);
    const { nome,descricao,dataHora,quantidadeCadeiras,cafe} = validatedData;

    const tipoExistente = await prisma.tipoSolicitacao.findFirst({
      where: { 
        nome
       },

    });
    if (tipoExistente) {
      if (tipoExistente.st_ativo) {
        return res.status(400).json({ error: "Tipo de solicitação já cadastrado" });
      } else {
        // Se existir, mas estiver inativo, atualizar para ativo
        await prisma.tipoSolicitacao.update({
          where: { id: tipoExistente.id },
          data: { st_ativo: true },
        });
    
        return res.status(201).json({
          message: "solicitação cadastrado com sucesso",
            id: tipoExistente.id,
            nome: tipoExistente.nome,
            status: true,
          
        });
      }
    }


    const novotipo = await prisma.tipoSolicitacao.create({
      data: {
        nome,
        descricao,
        dataHora,
        quantidadeCadeiras,
        cafe
        
      },
    });


    return res.status(201).json({
      message: "Tipo de chamado cadastrado com sucesso",
        id: novotipo.id,
        nome: novotipo.nome,
        status: novotipo.st_ativo,
      
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

export default cadastraTipoSolRouter;