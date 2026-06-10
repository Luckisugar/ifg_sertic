export async function cadastroEquipamento(nome: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equipamento/cadastraEquipamento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({nome})
    });
    const data = await res.json();
    if (res.status != 201){
      throw { error: data.error };
    } 
      return data;
  }