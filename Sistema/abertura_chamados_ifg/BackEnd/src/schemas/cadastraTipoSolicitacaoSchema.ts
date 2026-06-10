import { z } from 'zod';

export const tipoSolicitacaoSchema = z.object({
    nome: z.string().trim().min(3, {message: 'O nome é obrigatorio (minimo 3 caracteres)'}),
    descricao: z.string().min(10, {message: 'Descrição obrigatoria, minimo de 10 caracteres'}),
    cafe: z.boolean(),
    dataHora: z.boolean(),
    quantidadeCadeiras: z.boolean()
}).strict();

export type tipoSolicitacaoFormData = z.infer<typeof tipoSolicitacaoSchema>; //tipo inferido do schema 