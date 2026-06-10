import { z } from 'zod';

export const localSchema = z.object({
    nome: z.string().trim().min(3, {message: 'O nome e obrigatorio (minimo 3 caracteres)'}),
 
}).strict();

export type userFormData = z.infer<typeof localSchema>; //tipo inferido do schema 