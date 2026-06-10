import { z } from 'zod';

export const solicitacaoAdmSchema = z.object({
    chamadoId: z.number({ required_error: "ID do chamado é obrigatório" }),
    responsavel: z.string().optional(),
    dataPrevista: z.string().datetime({ message: "Data prevista inválida" }),
    prioridade: z.string().min(1, { message: "Prioridade é obrigatória" }),
    status: z.enum(["ABERTO", "EXECUÇÃO", "CANCELADO", "CONCLUÍDO"]),
    justificativa: z.string().optional()

}).strict();

export type userFormData = z.infer<typeof solicitacaoAdmSchema>; //tipo inferido do schema 