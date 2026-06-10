export async function cadastroTipoSolicitacao(nome: string, descricao: string, dataHora: boolean , quantidadeCadeiras: boolean, cafe:boolean) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/cadastraTipoSolicitacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({nome,descricao,dataHora,quantidadeCadeiras,cafe})
    });
    const data = await res.json();
    if (res.status != 201){
      throw { error: data.error || "Erro desconhecido ao cadastrar local" };
    } 
      return data;
  }