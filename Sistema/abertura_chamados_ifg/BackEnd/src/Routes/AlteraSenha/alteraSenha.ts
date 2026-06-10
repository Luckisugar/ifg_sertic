import { hashPassword } from "../../Services/funcoes/criptografaSenha";
import { Router, Request, Response } from "express";
import prisma from '../../lib/prisma';
import { alteraSenhaSchema } from "../../schemas/alteraSenhaSchema";
import { z, ZodError } from "zod"; // Importe o Zod e o ZodError

/**
 * * @swagger
 * /alteraSenha:
 * put:
 * summary: Altera a senha de um usuário
 * tags: [Usuário]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - senha
 * - confirmacaoSenha
 * - matricula
 * properties:
 * senha:
 * type: string
 * description: "Deve ter no mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número."
 * confirmacaoSenha:
 * type: string
 * matricula:
 * type: string
 * responses:
 * 200:
 * description: Senha alterada com sucesso
 * 400:
 * description: Erro de validação ou senhas diferentes
 * 404:
 * description: Usuário não encontrado
 */

const alteraSenhaRouter = Router();

alteraSenhaRouter.put("/alteraSenha", async (req: Request, res: Response) => {
    try {
      // 2. Valide o req.body usando o schema
      // O .parse() irá disparar um erro se a validação falhar
      const { senha, matricula } = alteraSenhaSchema.parse(req.body);
     
      // Se chegamos aqui, a validação passou (campos preenchidos, senhas iguais, e regras de força)
      // As validações 'if' anteriores não são mais necessárias.
      
      const usuario = await prisma.usuario.findUnique({
        where: { matricula: matricula },
        select: {
            id: true
        },
      });
      
      if (!usuario) {
          return res.status(404).json({ error: "Usuário solicitado para alteração de senha não encontrado!", ok:false });
        }else{
         const senhaCriptografada=  await hashPassword(senha);
            await prisma.usuario.update({
                where: { id: usuario.id },
                data: { senha: senhaCriptografada },
              });
        }
      
        //await enviarEmail(usuario.email, usuario.matricula);
        
     
  
      res.status(200).json({
          message: 'Operação realizada com sucesso!'
          ,ok:true
        });
        
    } catch (error: unknown) {
      // 3. Capture erros de validação do Zod
      if (error instanceof ZodError) {
        // Retorna uma resposta 400 com os detalhes dos erros
        return res.status(400).json({
          error: "Erro de validação.",
          // .flatten() formata os erros de um jeito fácil de consumir no frontend
          detalhes: error.flatten().fieldErrors,
          ok: false
        });
      }

      // Outros erros
      if (error instanceof Error) {
        res.status(400).json({ error: error.message, ok: false });
      } else {
        res.status(400).json({ error: "Ocorreu um erro desconhecido contate o administrador", ok: false });
      }
    }
  });

  export default alteraSenhaRouter;