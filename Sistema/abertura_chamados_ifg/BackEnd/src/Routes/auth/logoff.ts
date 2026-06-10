import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /logoff:
 *   post:
 *     summary: Realiza o logoff do usuário, invalidando o token atual
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logoff realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logoff realizado com sucesso."
 *                 tokensExpiradosRemovidos:
 *                   type: integer
 *                   description: Quantidade de tokens expirados removidos da blacklist
 *                   example: 3
 *       400:
 *         description: Erro na requisição ou token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token inválido"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token não fornecido."
 */

const logoffRouter = Router();

logoffRouter.post("/logoff", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res.status(400).json({ error: "Token inválido" });
    }

    // Verifica se já está na blacklist
    const blacklisted = await prisma.tokenBlacklist.findUnique({ where: { token } });
    if (blacklisted) {
      return res.status(400).json({ error: "Token já está inválido (usuário já deslogado)." });
    }

    // Adiciona o token atual à blacklist com validade de 6 meses
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setMonth(createdAt.getMonth() + 6);

    await prisma.tokenBlacklist.create({
      data: { token, createdAt, expiresAt },
    });

    // Remove tokens expirados
    const deleteResult = await prisma.tokenBlacklist.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return res.status(200).json({
      message: "Logoff realizado com sucesso.",
      tokensExpiradosRemovidos: deleteResult.count,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido, contate o administrador." });
    }
  }
});

export default logoffRouter;
