export async function atualizaStatusSolicitacaoNovo(chamadoPaiId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/atualizaStatusSolicitacaoNovo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chamadoPaiId }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error };
  }

  return data;
}
