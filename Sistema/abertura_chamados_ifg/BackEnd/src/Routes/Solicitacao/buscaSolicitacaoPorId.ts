// src/Routes/Solicitacao/buscaChamadoPorId.ts
import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /buscaSolicitacaoPorId:
 *   get:
 *     summary: Retorna os dados de um chamado específico pelo ID (via query string)
 *     tags:
 *       - Solicitações
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chamado que deseja buscar
 *     responses:
 *       200:
 *         description: Dados do chamado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 assunto:
 *                   type: string
 *                 status:
 *                   type: string
 *                 dataSolicitacao:
 *                   type: string
 *                   format: date-time
 *                 solicitante:
 *                   type: object
 *                 responsavel:
 *                   type: object
 *                 equipamento:
 *                   type: object
 *                   nullable: true
 *                 tipoSolicitacao:
 *                   type: object
 *                 local:
 *                   type: object
 *       404:
 *         description: Chamado não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Chamado não encontrado
 *       400:
 *         description: Erro na requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ocorreu um erro desconhecido contate o administrador
 */

const buscaChamadoPorId = Router();


buscaChamadoPorId.get("/buscaSolicitacaoPorId", async (req: Request, res: Response) => {
  const id = req.query.id ? parseInt(req.query.id as string) : NaN;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const chamado = await prisma.chamado.findUnique({
      where: { id },
      include: {
        solicitante: true,
        equipamento: true,
        tipoSolicitacao: true,
        local: true,
        alteracoes: true,
        chamadosFilhos: {
          include: {
            solicitante: true,
            equipamento: true,
            tipoSolicitacao: true,
            local: true,
            alteracoes: true
          }
        }

      },
    });

    if (!chamado) {
      return res.status(404).json({ error: "Chamado não encontrado" });
    }

    return res.status(200).json(chamado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
    }
  }
});

export default buscaChamadoPorId;
