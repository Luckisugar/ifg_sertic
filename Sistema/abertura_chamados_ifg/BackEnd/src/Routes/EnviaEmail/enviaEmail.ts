import prisma from "../../lib/prisma";
import { enviarEmail } from "../../Services/funcoes/enviarEmail";
import { mascararEmail } from "../../Services/funcoes/mascaraEmail"; 
import { Router, Request, Response } from "express";

/**
 * @swagger
 * /enviaEmail:
 *   post:
 *     summary: Envia um e-mail para o usuário com base na matrícula informada
 *     tags:
 *       - E-mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricula
 *             properties:
 *               matricula:
 *                 type: string
 *                 description: Matrícula do usuário para o envio de e-mail
 *                 example: "20250001"
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operação realizada com sucesso!"
 *                 email:
 *                   type: string
 *                   description: E-mail do usuário mascarado
 *                   example: "joa****@gmail.com"
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Erro na requisição ou erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "O campo 'matricula' é obrigatório."
 *                 ok:
 *                   type: boolean
 *                   example: false
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
 *                 ok:
 *                   type: boolean
 *                   example: false
 *       405:
 *         description: Método não permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Método não permitido"
 *                 ok:
 *                   type: boolean
 *                   example: false
 */

const emailRouter = Router();

emailRouter.post("/enviaEmail", async (req: Request, res: Response) => {
  try {
    const { matricula} = req.body;
   
    
    if (!matricula) {
      return res.status(400).json({ error: "O campo 'matricula' é obrigatório.",ok: false });
    }
    
    const usuario = await prisma.usuario.findUnique({
      where: { matricula: matricula },
      select: {
        email: true,
        matricula: true,
      },
    });
    
    if (!usuario || !usuario.email || !usuario.matricula) {
        return res.status(404).json({ error: "Usuário não encontrado!" ,ok: false});
      }
    
      await enviarEmail(usuario.email, usuario.matricula);
      
   const emailMascarado= mascararEmail(usuario.email);

    res.status(200).json({
        message: 'Operação realizada com sucesso!',
        email: emailMascarado ,
        ok: true
      });
      
  } catch (error: unknown) {
    // Verifica se o erro tem a propriedade 'message' e se é uma instância de Error
    if (error instanceof Error) {
      res.status(400).json({ error: error.message ,ok: false});
    } else {
      res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador" ,ok: false});
    }
  }
});

export default emailRouter; 