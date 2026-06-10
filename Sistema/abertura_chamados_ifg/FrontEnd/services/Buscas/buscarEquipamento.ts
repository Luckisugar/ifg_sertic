export async function buscarEquipamento() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equipamento/buscaEquipamentos`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.status != 200) {
      throw { error: data.error };
    }
    //const dataModificada = JSON.stringify(data, null, 2)
    return data;
  }