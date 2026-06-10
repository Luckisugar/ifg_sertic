export async function atualizaTodosSolicitacao(
  solicitacaoId: number, 
  equipamentoId: number,
  tipoSolicitacaoId: number,
  localId: number,
  descricao: string,
  observacao: string,
  assunto: string,
  cafe: boolean,
  dataHora: Date,
  quantidadeCadeiras: number

) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/atualizaTodosSolicitacao`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      solicitacaoId,
      equipamentoId,
      tipoSolicitacaoId,
      localId,
      descricao,
      observacao,
      assunto,
      cafe,
      dataHora: dataHora.toISOString,
      quantidadeCadeiras }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error };
  }

  return data;
}