export async function atualizarEquipamento(id: number, status: boolean) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equipamento/atualizaEquipamento`, {
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