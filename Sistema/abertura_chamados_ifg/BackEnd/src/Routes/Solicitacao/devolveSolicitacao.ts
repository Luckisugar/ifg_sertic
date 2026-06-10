  import { Router, Request, Response } from "express";
  import prisma from "../../lib/prisma";
  import { z } from "zod";
  import { devolveSolicitacaoSchema } from "../../schemas/devolveSolicitacaoSchema";

  /**
   * @swagger
   * /devolveSolicitacao:
   *   put:
   *     summary: Devolve uma solicitação com justificativa
   *     tags:
   *       - Solicitações
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DevolveSolicitacaoInput'
   *     responses:
   *       200:
   *         description: Solicitação devolvida com sucesso
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Solicitação não encontrada
   *       500:
   *         description: Erro interno
   *
   * components:
   *   schemas:
   *     DevolveSolicitacaoInput:
   *       type: object
   *       required:
   *         - solicitacaoId
   *         - justificativa
   *       properties:
   *         solicitacaoId:
   *           type: integer
   *           example: 12
   *         justificativa:
   *           type: string
   *           example: "O equipamento informado não existe"
   */

  const devolveSolicitacaoRouter = Router();


  devolveSolicitacaoRouter.put("/devolveSolicitacao", async (req: Request, res: Response) => {
    try {
      const validaData = devolveSolicitacaoSchema.parse(req.body);
      const { solicitacaoId, justificativa } = validaData;

      const chamado = await prisma.chamado.findUnique({
        where: { id: solicitacaoId },
      });

      if (!chamado) {
        return res.status(404).json({ error: "Solicitação não encontrada" });
      }

      // Atualiza o status do chamado para "DEVOLVIDO"
      await prisma.chamado.update({
        where: { id: solicitacaoId },
        data: { status: "RASCUNHO" },
      });

      // Cria o registro na tabela Alteracao
      await prisma.alteracao.create({
        data: {
          chamadoId: solicitacaoId,
          justificativa,
          status: "RASCUNHO",
        }, // o pull anterior ja veio com erro (aparentemente temos de declarar as duas colunas faltosas como optional)
      });
  
      return res.status(200).json({ message: "Solicitação devolvida com sucesso" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0]?.message });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  export default devolveSolicitacaoRouter;
