export async function buscaEquipamentos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equipamento/buscaEquipamentosAtivo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw { error: data.error || "Erro ao buscar equipamentos" };
  }

  return data.equipamentoExistente; // retorna apenas o array de equipamentos
}
