// src/Routes/Solicitacao/buscaChamados.ts
import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /buscaSolicitacaoPai:
 *   get:
 *     summary: Retorna uma lista paginada de chamados que possuem filhos
 *     tags:
 *       - Solicitações
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número da página que deseja consultar
 *     responses:
 *       200:
 *         description: Lista paginada de chamados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chamados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       descricao:
 *                         type: string
 *                       assunto:
 *                         type: string
 *                       status:
 *                         type: string
 *                       dataSolicitacao:
 *                         type: string
 *                         format: date-time
 *                       solicitante:
 *                         type: object
 *                       responsavel:
 *                         type: object
 *                       equipamento:
 *                         type: object
 *                         nullable: true
 *                       tipoSolicitacao:
 *                         type: object
 *                       local:
 *                         type: object
 *                 totalChamados:
 *                   type: integer
 *                   example: 120
 *                 pagina:
 *                   type: integer
 *                   example: 1
 *                 totalPaginas:
 *                   type: integer
 *                   example: 4
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
 *     
 */

const buscaSolicitacaoPai = Router();


buscaSolicitacaoPai.get("/buscaSolicitacaoPai", async (req: Request, res: Response) => {
  
  const pagina = parseInt(req.query.page as string) || 1; // Página atual (default: 1)
  const limitePorPagina = 5; // Quantidade de registros por página
  const registrosParaPular = (pagina - 1) * limitePorPagina; // Cálculo para saber quantos registros ignorar

  try {
    
    const [chamados, totalChamados] = await Promise.all([
      
      prisma.chamado.findMany({
        skip: registrosParaPular,
        take: limitePorPagina,
        orderBy: { dataSolicitacao: "desc" }, // Ordena do mais recente para o mais antigo
        where: {
          chamadoPaiId: null, // Filtra apenas os chamados "pai"
          status: {
            not: "RASCUNHO"
          },
        },
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
        }
      }),
      prisma.chamado.count({
        where: {
          chamadoPaiId: null,
          status: {
            not: "RASCUNHO"
          },
        }
      })
    ]);

    return res.status(200).json({
      chamados,
      totalChamados,
      pagina,
      totalPaginas: Math.ceil(totalChamados / limitePorPagina),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
    }
  }
});

export default buscaSolicitacaoPai;
