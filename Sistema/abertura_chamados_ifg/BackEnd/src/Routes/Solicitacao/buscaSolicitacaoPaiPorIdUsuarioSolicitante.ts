import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";


/**
 * @swagger
 * /buscaSolicitacaoPaiPorIdUsuarioSolicitante:
 *   get:
 *     summary: Retorna uma lista paginada de chamados pais feitos por um solicitante
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
 *       - in: query
 *         name: solicitanteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do solicitante dos chamados
 *     responses:
 *       200:
 *         description: Lista paginada de chamados pais do solicitante informado
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
 *                       alteracoes:
 *                         type: array
 *                         items:
 *                           type: object
 *                       chamadosFilhos:
 *                         type: array
 *                         items:
 *                           type: object
 *                 totalChamados:
 *                   type: integer
 *                   example: 25
 *                 pagina:
 *                   type: integer
 *                   example: 1
 *                 totalPaginas:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Erro na requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ocorreu um erro desconhecido. Contate o administrador.
 */

const buscaSolicitacaoPaiPorIdUsuarioSolicitante = Router();


buscaSolicitacaoPaiPorIdUsuarioSolicitante.get("/buscaSolicitacaoPaiPorIdUsuarioSolicitante", async (req: Request, res: Response) => {
  const pagina = parseInt(req.query.page as string) || 1;
  const limitePorPagina = 2;
  const registrosParaPular = (pagina - 1) * limitePorPagina;

  const solicitanteId = Number(req.query.solicitanteId);


  if (!solicitanteId) {
    return res.status(400).json({ error: "O parâmetro 'solicitanteId' é obrigatório." });
  }

  try {
    const [chamados, totalChamados] = await Promise.all([
      prisma.chamado.findMany({
        skip: registrosParaPular,
        take: limitePorPagina,
        orderBy: { dataSolicitacao: "desc" },
        where: {
          chamadoPaiId: null,
          solicitanteId: solicitanteId,
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
          solicitanteId: solicitanteId,
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
      res.status(400).json({ error: "Ocorreu um erro desconhecido. Contate o administrador." });
    }
  }
});

export default buscaSolicitacaoPaiPorIdUsuarioSolicitante;
