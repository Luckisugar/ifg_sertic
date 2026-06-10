import { z } from "zod";

export const alteraSolicitacaoSchema = z.object({
  solicitacaoId: z.number({ required_error: "ID da solicitação é obrigatório" }),
  status: z.string().nullable(),
  prioridade: z.string().nullable(),
  dataPrevista: z.string().datetime().nullable(),
  responsavel: z.string().nullable(),
  justificativa: z.string().optional()
});
