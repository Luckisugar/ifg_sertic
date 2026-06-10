import { z } from 'zod';

export const userSchema = z.object({
    nome: z.string().min(3, {message: 'O nome e obrigatorio (minimo 3 caracteres)'}),
    matricula: z.string().min(10, {message: 'Matricula Obrigatoria'}),
    senha: z.string().min(6, {message: 'Minimo de 6 caracteres para a senha'}),
    email: z.string().email({message: 'Email invalido'}).optional().or(z.literal('')),
    tipoUsuario: z.enum(['ADMIN', 'ENCARREGADO' ]) //REVER OS ENUMERADORES!!! 
}).strict();

export type userFormData = z.infer<typeof userSchema>; //tipo inferido do schema