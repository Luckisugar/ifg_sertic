import { z } from 'zod';

export const userSchema = z.object({
    nome: z.string().min(3, {message: 'O nome e obrigatorio (minimo 3 caracteres)'}),
    matricula: z.string().min(10, {message: 'Matricula Obrigatoria, minimo de 10 numeros'}),
    email: z.string().email({message: 'Email invalido'}),
    tipoUsuario: z.enum(['ADMIN','SOLICITANTE','ENCARREGADO']) //REVER OS ENUMERADORES!!! 
}).strict();

export type userFormData = z.infer<typeof userSchema>; //tipo inferido do schema 