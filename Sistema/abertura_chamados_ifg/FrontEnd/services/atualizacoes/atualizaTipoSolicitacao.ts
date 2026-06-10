export async function atualizarTipoSolicitacao(id: number, status: boolean) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/atualizaTipoSolicitacao`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, st_ativo: status }),
    });
    const data = await res.json();
    if (res.status != 200) {
      throw { error: data.error };
    }
  
    return data;
  }