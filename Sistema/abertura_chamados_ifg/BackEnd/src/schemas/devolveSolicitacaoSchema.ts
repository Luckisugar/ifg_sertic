import { z } from "zod";

export const devolveSolicitacaoSchema = z.object({
  solicitacaoId: z.number({ required_error: "ID da solicitação é obrigatório" }),
  justificativa: z.string().min(10, { message: "Justificativa é obrigatória (minimo 10 caracteres)" }),
});

export type DevolveSolicitacaoInput = z.infer<typeof devolveSolicitacaoSchema>;
