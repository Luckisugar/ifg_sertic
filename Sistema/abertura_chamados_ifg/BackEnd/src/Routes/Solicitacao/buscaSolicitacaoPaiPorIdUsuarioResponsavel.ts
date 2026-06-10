import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /buscaSolicitacaoPaiPorIdUsuarioResponsavel:
 *   get:
 *     summary: Retorna uma lista paginada de chamados pais atribuídos a um responsável
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
 *         name: responsavelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário responsável pelos chamados
 *     responses:
 *       200:
 *         description: Lista paginada de chamados pais atribuídos ao responsável informado
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


const buscaSolicitacaoPaiPorIdUsuarioResponsavel = Router();


buscaSolicitacaoPaiPorIdUsuarioResponsavel.get("/buscaSolicitacaoPaiPorIdUsuarioResponsavel", async (req: Request, res: Response) => {
  const pagina = parseInt(req.query.page as string) || 1;
  const limitePorPagina = 2;
  const registrosParaPular = (pagina - 1) * limitePorPagina;

  const responsavelId = Number(req.query.responsavelId);


  if (!responsavelId) {
    return res.status(400).json({ error: "O parâmetro 'responsavelId' é obrigatório." });
  }

  try {
    const [chamados, totalChamados] = await Promise.all([
      prisma.chamado.findMany({
        skip: registrosParaPular,
        take: limitePorPagina,
        orderBy: { dataSolicitacao: "desc" },
        where: {
          chamadoPaiId: null,
          status: {
            not: "RASCUNHO"
          }
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
          }
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

export default buscaSolicitacaoPaiPorIdUsuarioResponsavel;
