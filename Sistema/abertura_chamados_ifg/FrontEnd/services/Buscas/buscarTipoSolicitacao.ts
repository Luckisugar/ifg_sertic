export async function buscarTipoSolicitacao() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/buscaTipoSolicitacoes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: 'no-store'
    });
    
    const data = await res.json();
    console.log("Resposta do servidor:", res.json);
    if (res.status != 200) {
      throw { error: data.error || "Erro desconhecido ao cadastrar o tipo de solicitação" };
    }

    return data;
  }