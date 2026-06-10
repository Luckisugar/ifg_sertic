export async function cadastraSolicitacao(
    tipoSolicitacaoId: number,
    solicitanteId:number,
    localId:number,
    equipamentoId:number | null,
    descricao:string,
    assunto:string,
    status:string | null,
    chamadoPaiId:number | null,
    cafe: boolean | null,
    dataHora: boolean | null,
    quantidadeCadeiras: boolean | null,
 ) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/solicitacao/cadastraSolicitacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({tipoSolicitacaoId,solicitanteId,localId,equipamentoId,descricao,assunto,status,chamadoPaiId,cafe,dataHora,quantidadeCadeiras})
    });
    const data = await res.json();
    if (res.status != 201){
      throw { error: data.error };
    } 
      return data;
  }