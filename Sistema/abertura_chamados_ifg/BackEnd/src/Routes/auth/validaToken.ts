import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /validaToken:
 *   post:
 *     summary: Valida e consome um token de acesso para um usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - matricula
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de acesso enviado para o usuário
 *                 example: "abc123xyz"
 *               matricula:
 *                 type: string
 *                 description: Matrícula do usuário associado ao token
 *                 example: "20250001"
 *     responses:
 *       200:
 *         description: Token validado e acesso permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso permitido"
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dados inválidos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token ou ID inválidos"
 *       404:
 *         description: Token inválido ou já utilizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token inválido ou já utilizado"
 *                 ok:
 *                   type: boolean
 *                   example: false
 */

const validaTokenRouter = Router();

validaTokenRouter.post("/validaToken", async (req: Request, res: Response) => {
  
  const { token, matricula } = req.body;

  if (!token || typeof token !== 'string' || !matricula || typeof matricula !== 'string') {
    return res.status(400).json({ error: 'Token ou ID inválidos' });
  }

  // Buscar e deletar o token do banco de dados para esse usuário específico
  const tokenEntry = await prisma.accessToken.delete({
    where: {   
      token, 
      matricula 
    },
  }).catch(() => null);

  if (!tokenEntry) {
    return res.status(404).json({
      error: 'Token inválido ou já utilizado',
      ok: false

    });
  }

  return res.status(200).json({message: 'Acesso permitido', ok: true});

});

export default validaTokenRouter;