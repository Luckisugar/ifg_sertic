export async function cadastroLocal(nome: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/local/cadastraLocal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({nome})
    });
    console.log("Status da resposta:");
  
    const data = await res.json();
    console.log("Resposta do servidor:", data);
    if (res.status != 201){
      throw { error: data.error || "Erro desconhecido ao cadastrar local" };
    } 
      return data;
  }