export async function devolveSolicitacao(
  solicitacaoId: number,
  justificativa: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/devolveSolicitacao`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      solicitacaoId,
      justificativa,
    }),
  });

  const data = await res.json();

  if (res.status != 200){
      throw { error: data.error || "Erro ao devolver solicitação" };
    } 

  return data; // { message: "Solicitação devolvida com sucesso" }
}
