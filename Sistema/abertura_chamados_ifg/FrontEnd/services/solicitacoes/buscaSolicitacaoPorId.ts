export async function buscarChamadoPorId(id: number) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/buscaSolicitacaoPorId?id=${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 404) {
    throw { error: "Chamado não encontrado." };
  }

  if (res.status !== 200) {
    throw { error: data.error || "Erro ao buscar o chamado." };
  }

  return data; // objeto com os dados do chamado
}
