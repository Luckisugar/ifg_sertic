import { z } from "zod";

export const updateChamadoStatusSchema = z.object({
  chamado_id: z
    .number({ required_error: "O ID do chamado é obrigatório." })
    .int({ message: "O ID deve ser inteiro." })
    .positive({ message: "O ID deve ser positivo." }),

  status: z.enum(["EM EXECUCAO", "AGUARDANDO VALIDACAO"], {
    required_error: "O status é obrigatório.",
    invalid_type_error: "Status inválido. Use 'EM EXECUCAO' ou 'AGUARDANDO VALIDACAO'.",
  })
});

export type UpdateChamadoStatusDTO = z.infer<typeof updateChamadoStatusSchema>;
