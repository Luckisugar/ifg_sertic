export async function apagarSolicitacaoFilhaPorId(id: number) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/apagaSolicitacaoFilha/${id}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();


  if (res.status !== 200) {
    throw { error: data.error || "Erro ao deletar a solicitação." };
  }

  return data; // objeto com a mensagem de sucesso
}
