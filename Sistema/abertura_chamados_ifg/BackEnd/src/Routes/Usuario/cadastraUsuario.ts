import prisma from "../../lib/prisma";
import { userSchema } from "../../schemas/cadastraUsuarioSchema";
import { z } from "zod";
import { enviaEmail } from "../../Services/EnviarEmail/enviarEmail";
import { criaSenha } from "../../Services/funcoes/criaSenha";
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /cadastraUsuario:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Usuário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               matricula:
 *                 type: string
 *                 example: "123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva@email.com"
 *               tipoUsuario:
 *                 type: string
 *                 example: "ADMIN"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário cadastrado com sucesso"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: "João Silva"
 *                     matricula:
 *                       type: string
 *                       example: "123456"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "joao.silva@email.com"
 *                     tipoUsuario:
 *                       type: string
 *                       example: "ADMIN"
 *       400:
 *         description: Dados inválidos ou matrícula já cadastrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Dados inválidos"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */

const cadastraUserRouter = Router();

cadastraUserRouter.post("/cadastraUsuario", async (req: Request, res: Response) => {
  try {
    const validatedData = userSchema.parse(req.body);
    const { nome, matricula, email, tipoUsuario } = validatedData;

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { matricula },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Matrícula já cadastrada" });
    }

    const senhaAutomatica = criaSenha();

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        senha: senhaAutomatica,
        matricula,
        email: email,
        tipoUsuario,
      },
    });

    const enviandoEmail = await enviaEmail(matricula);

    if (!enviandoEmail.ok) {
      return res.status(500).json({ error: "Erro ao enviar email" });
    }
    return res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        matricula: novoUsuario.matricula,
        email: novoUsuario.email,
        tipoUsuario: novoUsuario.tipoUsuario,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors[0]?.message || "Erro de validação",
      });
    }

    
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default cadastraUserRouter;
