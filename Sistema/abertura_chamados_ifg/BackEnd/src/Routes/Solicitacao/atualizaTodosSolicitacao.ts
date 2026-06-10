import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { atualizaTodosSolicitacaoSchema } from "../../schemas/atualizaTodosSolicitacaoSchema";
import { z } from "zod";

/**
 * @swagger
 * /solicitacao/atualizaTodosSolicitacao:
 *   put:
 *     summary: Atualiza os dados de uma solicitação existente
 *     tags:
 *       - Solicitações
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - solicitacaoId
 *             properties:
 *               solicitacaoId:
 *                 type: integer
 *                 description: ID da solicitação que será atualizada
 *               equipamentoId:
 *                 type: integer
 *                 nullable: true
 *               tipoSolicitacaoId:
 *                 type: integer
 *                 nullable: true
 *               localId:
 *                 type: integer
 *                 nullable: true
 *               descricao:
 *                 type: string
 *                 nullable: true
 *               observacao:
 *                 type: string
 *                 nullable: true
 *               assunto:
 *                 type: string
 *                 nullable: true
 *               cafe:
 *                 type: boolean
 *                 nullable: true
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Solicitação alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Solicitação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

const atualizaTodosSolicitacao = Router();

type AtualizacaoChamado = {
  equipamento?: { connect: { id: number } };
  tipoSolicitacao?: { connect: { id: number } };
  local?: { connect: { id: number } };
  descricao?: string;
  observacao?: string;
  assunto?: string;
  cafe?: boolean;
  dataHora?: Date;
  quantidadeCadeiras?: number;
};

atualizaTodosSolicitacao.put("/atualizaTodosSolicitacao", async (req: Request, res: Response) => {
  try {
    const data = atualizaTodosSolicitacaoSchema.parse(req.body);
    const { solicitacaoId, equipamentoId, tipoSolicitacaoId, localId, descricao, observacao, assunto, cafe, dataHora ,quantidadeCadeiras} = data;

    const chamadoExistente = await prisma.chamado.findUnique({
      where: { id: solicitacaoId },
    });

    if (!chamadoExistente) {
      return res.status(404).json({ error: "Solicitação não encontrada" });
    }

    const atualizacaoChamado: AtualizacaoChamado = {};

    if (equipamentoId !== null) {
      atualizacaoChamado.equipamento = { connect: { id: equipamentoId } };
    }
    if (tipoSolicitacaoId !== null) {
      atualizacaoChamado.tipoSolicitacao = { connect: { id: tipoSolicitacaoId } };
    }
    if (localId !== null) {
      atualizacaoChamado.local = { connect: { id: localId } };
    }
    if (descricao !== null) atualizacaoChamado.descricao = descricao;
    if (observacao !== null) atualizacaoChamado.observacao = observacao;
    if (assunto !== null) atualizacaoChamado.assunto = assunto;
    if (cafe !== null) atualizacaoChamado.cafe = cafe;
    if (dataHora !== null) atualizacaoChamado.dataHora = new Date(dataHora);
    if (quantidadeCadeiras !== null) atualizacaoChamado.quantidadeCadeiras=quantidadeCadeiras;

    if (Object.keys(atualizacaoChamado).length > 0) {
      await prisma.chamado.update({
        where: { id: solicitacaoId },
        data: atualizacaoChamado,
      });
    }

    return res.status(200).json({ message: "Solicitação alterada com sucesso" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }

    
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});


export default atualizaTodosSolicitacao;
