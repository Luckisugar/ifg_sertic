import { z } from 'zod';

export const equipamentoSchema = z.object({
    nome: z.string().trim().min(3, {message: 'O nome e obrigatorio (minimo 3 caracteres)'}),
    //A table tem campo descricao, podemos adicionar futuramente (caso nao quebre nada)
}).strict();

export type userFormData = z.infer<typeof equipamentoSchema>; //tipo inferido do schema 