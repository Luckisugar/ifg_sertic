import prisma from "../../lib/prisma";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Tipos de Solicitação Ativas
 *   description: Gerenciamento de tipos de solicitação ativas

 * /buscaTipoSolicitacoesAtiva:
 *   get:
 *     summary: Buscar todos os tipos de solicitação ativas
 *     tags: [Tipos de Solicitação]
 *     responses:
 *       200:
 *         description: Lista de tipos de solicitação retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoExistente:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Manutenção"
 *                       st_ativo:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Erro ao buscar os tipos de solicitação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar tipos de solicitação"
 */

const buscaTipoSolRouter = Router();


buscaTipoSolRouter.get("/buscaTipoSolicitacoesAtiva", async (req: Request, res: Response) => {
  type TipoCampo =
    | {
      nome: "dataHora";
      label: string;
      tipo: "dateHora";
    }
    | {
      nome: "servirCafe";
      label: string;
      tipo: "checkbox";
      opcoes: string[];
    }
    | {
      nome: "quantidadeCadeiras";
      label: string;
      tipo: "text";
    };

  try {

    const tipoExistente = await prisma.tipoSolicitacao.findMany({
      where: {
        st_ativo: true
      }
    });

    const tiposComCampos = tipoExistente.map((tipo) => {
      const campos: TipoCampo[] = [];

      if (tipo.dataHora) {
        campos.push({
          nome: "dataHora",
          label: "Data e hora",
          tipo: "dateHora",
        });
      }

      if (tipo.cafe) {
        campos.push({
          nome: "servirCafe",
          label: "Servir café",
          tipo: "checkbox",
          opcoes: ["Sim", "Não"],
        });
      }

      if (tipo.quantidadeCadeiras) {
        campos.push({
          nome: "quantidadeCadeiras",
          label: "Quantidade de cadeiras",
          tipo: "text",
        });
      }

      return {
        ...tipo,
        front: {
          tipo: tipo.nome, // tipo igual ao nome, para todos
          campos,
        }, // sempre presente, mesmo se for um array vazio
      };
    });

    return res.status(200).json({
      tipoExistente: tiposComCampos

    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
    }


  }
});

export default buscaTipoSolRouter;
