import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /retornaUsuario:
 *   get:
 *     summary: Retorna informações do usuário autenticado
 *     tags:
 *       - Autenticação
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: "João da Silva"
 *                     tipoUsuario:
 *                       type: string
 *                       example: "admin"
 *                     matricula:
 *                       type: string
 *                       example: "20250001"
 *       400:
 *         description: Erro ao processar o token ou erro interno
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
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido."
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado."
 */

const retornaUsuarioRouter = Router(); 

retornaUsuarioRouter.get('/retornaUsuario', async (req: Request, res: Response) => {
 
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido." });

  const token = authHeader.split(" ")[1];
  try {
    const blacklisted = await prisma.tokenBlacklist.findUnique({ where: { token } });
    if (blacklisted) {
      return res.status(404).json({ error: "Token Inválido." ,ok: false});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; tipoUsuario: string };
    const usuario = await prisma.usuario.findUnique({ where: { id: decoded.userId }, select: { id: true, nome: true, tipoUsuario: true, matricula: true } });
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
    res.status(200).json({ usuario ,ok: true});
  } catch (error: unknown) {
    if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" });
      }
   
  }
});

export default retornaUsuarioRouter; 
