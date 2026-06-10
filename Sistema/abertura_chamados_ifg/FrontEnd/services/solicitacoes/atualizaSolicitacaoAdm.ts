export async function atualizaSolicitacaoAdm(
  chamadoId: number,
  responsavelId: number,
  dataPrevista: Date,
  prioridade: string,
  status: "ABERTO" | "EXECUÇÃO" | "CANCELADO" | "CONCLUÍDO",
  justificativa?: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/atualizaSolicitacaoAdm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      chamadoId,
      responsavelId,
      dataPrevista: dataPrevista.toISOString(), // Corrigido
      prioridade,
      status,
      justificativa, // só será enviado se for definido
    }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error };
  }

  return data;
}
