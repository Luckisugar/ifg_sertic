import { useState } from "react";

const useChamado = () => {
  const [chamados, setChamados] = useState<any>({});
  
  const updateChamado = (name: string, value: string) => {
    setChamados((prevChamados: any) => ({
      ...prevChamados,
      [name]: value,
    }));
  };
  
  const resetChamado = () => {
    setChamados({
      assunto: "",
      descricao: "",
      local: "",
      equipamento: "",
      dataAtual: "",
      tipo: "",
      midia: "",
      subChamados: [],
    });
  };
  
  return { chamados, updateChamado, resetChamado };
};

export default useChamado;
