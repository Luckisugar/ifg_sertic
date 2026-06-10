import { z } from 'zod';

export const solicitacaoSchema = z.object({
    tipoSolicitacaoId: z.number({ required_error: 'Tipo de solicitação é obrigatório' }),
    solicitanteId: z.number({ required_error: 'Solicitante é obrigatório' }),
    localId: z.number({ required_error: 'Local é obrigatório' }),
    equipamentoId: z.number().nullable(),
    descricao: z.string().min(10, { message: 'A descrição e obrigatoria (minimo 10 caracteres)' }),
    assunto: z.string().min(8, { message: 'Assunto Obrigatorio, minimo de 8 caracteres' }),
    status: z.enum(['NOVO', 'RASCUNHO', 'FINALIZADO', 'ENVIADO', 'EM EXECUÇÃO','DEVOLVIDO']), //REVER OS ENUMERADORES!!!  //REVER OS ENUMERADORES!!! 
    observacao: z.string().nullable(),           // string ou null
    chamadoPaiId: z.number().nullable(),         // número ou null
    cafe: z.boolean().nullable(),                // boolean ou null
    dataHora: z.string().datetime().nullable(),  // ISO string de data ou null
    quantidadeCadeiras: z.number().nullable(),
    subChamado: z.boolean().nullable()
}).strict();

export type userFormData = z.infer<typeof solicitacaoSchema>; //tipo inferido do schema 