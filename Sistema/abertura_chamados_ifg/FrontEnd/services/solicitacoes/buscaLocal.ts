export async function buscaLocais() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/local/buscaLocalAtivo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error || "Erro ao buscar locais" };
  }

  return data.localExistente; // retorna o array de locais
}
