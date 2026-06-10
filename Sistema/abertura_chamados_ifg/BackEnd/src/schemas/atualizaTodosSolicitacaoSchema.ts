import { z } from "zod";

export const atualizaTodosSolicitacaoSchema = z.object({
  solicitacaoId: z.number({ required_error: "ID da solicitação é obrigatório" }),
  equipamentoId: z.number().nullable(),
  tipoSolicitacaoId: z.number().nullable(),
  localId: z.number().nullable(),
  descricao: z.string().min(10, { message: 'A descrição e obrigatoria (minimo 10 caracteres)' }).nullable(),
  observacao: z.string().nullable(),
  assunto: z.string().min(8, { message: 'Assunto Obrigatorio, minimo de 8 caracteres' }).nullable(),
  cafe: z.boolean().nullable(),
  dataHora: z.string().datetime().nullable(),
  quantidadeCadeiras: z.number().nullable()
});
