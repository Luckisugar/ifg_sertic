export async function alterarSenha(senha: string, confirmacaoSenha:string,matricula: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/senha/alteraSenha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha, confirmacaoSenha, matricula}),
    });
    const data = await res.json();
    if (!res.ok) throw { error: data.error };
    return data;
  }