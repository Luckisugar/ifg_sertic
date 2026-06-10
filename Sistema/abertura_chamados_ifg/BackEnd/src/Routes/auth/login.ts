import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import validatePassword  from "../../Services/funcoes/validarSenha";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login de um usuário
 *     tags: 
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricula
 *               - password
 *             properties:
 *               matricula:
 *                 type: string
 *                 description: Matrícula do usuário
 *                 example: "20250001"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "MinhaSenhaSegura123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login bem-sucedido!"
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 tipoUsuario:
 *                   type: string
 *                   description: Tipo de usuário
 *                   example: "admin"
 *       400:
 *         description: Requisição inválida (faltando campos ou erro interno)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Matrícula e senha são obrigatórios."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro no login. Verifique suas credenciais."
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado!"
 */


const loginRouter = Router();

loginRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { matricula, password } = req.body;

    if (!matricula || !password) {
      return res.status(400).json({ error: "Matrícula e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { matricula },
      select: {
        id: true,
        senha: true,
        tipoUsuario: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const senhaValida = await validatePassword(password, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Erro no login. Verifique suas credenciais." });
    }

    const token = jwt.sign(
      { userId: usuario.id, tipoUsuario: usuario.tipoUsuario },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      tipoUsuario: usuario.tipoUsuario,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido, contate o administrador." });
    }
  }
});

export default loginRouter;
