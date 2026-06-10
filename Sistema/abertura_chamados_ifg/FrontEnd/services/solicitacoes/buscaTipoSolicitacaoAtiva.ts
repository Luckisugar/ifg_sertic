export async function buscarTiposSolicitacaoAtiva() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/buscaTipoSolicitacoesAtiva`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error || "Erro ao buscar tipos de solicitação" };
  }

  return data.tipoExistente; // retorna o array de tipos ativos
}
