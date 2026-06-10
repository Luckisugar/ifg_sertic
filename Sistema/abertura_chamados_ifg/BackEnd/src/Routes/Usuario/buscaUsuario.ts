import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

/**
 * @swagger
 * /buscaUsuarios:
 *   get:
 *     summary: Retorna a lista de usuários cadastrados
 *     description: Retorna todos os usuários registrados no sistema, exibindo apenas seus identificadores e nomes.
 *     tags:
 *       - Usuário
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nome: "João Silva"
 *               - id: 2
 *                 nome: "Maria Souza"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: "Erro interno do servidor."
 */


const buscaUsuarios = Router();

buscaUsuarios.get("/buscaUsuarios", async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
      },
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

export default buscaUsuarios;
