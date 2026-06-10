import z from "zod";

export const alteraSenhaSchema = z.object({
  matricula: z.string().min(1, { message: "A matrícula é obrigatória." }),
  senha: z.string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/[a-z]/, { message: "A senha deve conter ao menos uma letra minúscula." })
    .regex(/[A-Z]/, { message: "A senha deve conter ao menos uma letra maiúscula." })
    .regex(/\d/, { message: "A senha deve conter ao menos um número." }),
  confirmacaoSenha: z.string(),
}).refine((data) => data.senha === data.confirmacaoSenha, {
  message: "As senhas não são iguais!",
  path: ["confirmacaoSenha"],
});