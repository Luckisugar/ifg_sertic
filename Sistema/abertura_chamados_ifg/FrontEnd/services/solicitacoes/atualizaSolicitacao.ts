export async function atualizarSolicitacao(
  solicitacaoId: number,
  status: string | null,
  prioridade: string | null,
  dataPrevista: Date | null,
  responsavelId: number | null,
  justificativa: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/atualizaSolicitacao`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      solicitacaoId,
      status,
      prioridade,
      dataPrevista: dataPrevista ? dataPrevista.toISOString() : null,
      responsavelId,
      justificativa,
    }),
  });

  const data = await res.json();

  if (res.status != 200) {
      throw { error: data.error };
    }

  return data; // { message: "Solicitação alterada com sucesso" }
}
