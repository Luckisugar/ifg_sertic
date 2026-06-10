export async function buscarChamadosPaiPorSolicitante(
  solicitanteId: number,
  pagina: number
) {


  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/buscaSolicitacaoPaiPorIdUsuarioSolicitante?page=${pagina}&responsavelId=${solicitanteId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error };
  }

  return data; // { chamados, totalChamados, pagina, totalPaginas }
}
