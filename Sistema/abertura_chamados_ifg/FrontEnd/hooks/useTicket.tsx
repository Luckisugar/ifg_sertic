import useAuth from "../services/auth/useAuth";
import { useRef, useState } from "react";
import dataSolicitacao from "../../tipoSolicitacao.json";
import local from "../../local.json";
import equipamentos from "../../equipamentos.json";
import moment, { updateLocale } from "moment";
import { CiCirclePlus } from "react-icons/ci";
import { Alert } from '@mui/material';
import { set } from "zod";
import { Router } from "express";

const useTicket = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [viewSubChamado, setViewSubChamado] = useState<boolean>(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [chamados, setChamados] = useState<any>({});
  const [valores, setValores] = useState<any>([]);
  const [tiposSolicitacao, setTiposSolicitacao] =
    useState<any>(dataSolicitacao);
  const dataAtual = moment().format("DD/MM/yyyy");
  const [viewForm, setViewForm] = useState<boolean>(true);
  const camposDinamicos =
    tiposSolicitacao.find((item: any) => item.tipo === tipoSelecionado)
      ?.campos || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editChamadoIndex, setEditChamadoIndex] = useState<number | null>(null);
  const [editSubChamadoIndex, setEditSubChamadoIndex] = useState<number | null>(
    null
  );
  const { usuario, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);


  function validateForm(chamados: any) {
    const chavesDosCampos = [
      "tipo",
      "assunto",
      "descricao",
      "local",

      ...camposDinamicos.map((item: any) => item.nome),
    ];
    for (const key of chavesDosCampos) {
      if (!chamados[key]) {
        const campoFormatado = formatarCampo(key);
        setError(`Por favor, preencha o campo ${campoFormatado}`);
        return false;
      }
    }
    return true;
  }
  const handleClick = () => {
    setOpen(true);
  };

  const handleSubmit = (e: any) => {
    setMensagem(null);
    setError(null);

    const { name, value } = e.target;

    setChamados({
      ...chamados,
      [name]: value,
      dataAtual,
    });
  };


  const handleAddChamado = async (chamados: any) => {
    setMensagem(null);
    setError(null);

    if (!validateForm(chamados)) {
      return;
    }

    setValores((prevValores: any) => {
      const updatedChamados: any = [...(prevValores.chamados || [])];
      if (updatedChamados.length > 0) {
        updatedChamados[updatedChamados.length - 1] = {
          ...updatedChamados[updatedChamados.length - 1],
          subChamados: [
            ...(updatedChamados[updatedChamados.length - 1].subChamados || []),
            {
              assunto: chamados.assunto,
              descricao: chamados.descricao,
              local: chamados.local,
              equipamento: chamados.equipamento,
              data: chamados.dataAtual,
              tipo: chamados.tipo,
              midia: chamados.midia
            },
          ],
        };
      }

      setMensagem("Chamado cadastrado com sucesso!");
      return { ...prevValores, chamados: updatedChamados };

    });
    setViewForm(false);
    // handleToggleHiddenForm();
    resetForm();


  };



  const handleAddSubChamado = (e: any) => {
    e.preventDefault();

    setMensagem(null);
    setError(null);

    if (!validateForm(chamados)) {
      return;
    }
    setValores((prevValores: any) => ({

      ...prevValores,
      chamados: [
        ...(prevValores.chamado || []),
        {
          assunto: chamados.assunto,
          descricao: chamados.descricao,
          local: chamados.local,
          equipamento: chamados.equipamento,
          data: chamados.dataAtual,
          tipo: chamados.tipo,
          midia: chamados.midia,
          subChamados: [],
        },
      ],
    }));
    setViewSubChamado(!viewSubChamado);
    resetForm();
  };

  function formatarCampo(campo: string) {
    return campo
      .replace(/([A-Z])/g, " do $1")
      .toLowerCase()
      .trim();
  }
  // const camposFormatados = Object.keys(valores).map((key) => formatarCampo(key));

  function resetForm() {
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
    setTipoSelecionado("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  // };
  const handleDeleteSubChamado = (
    chamadoIndex: number,
    subChamadoIndex: number
  ) => {
    setValores((prevValores: any) => {
      const novosChamados = prevValores.chamados.map(
        (chamado: any, index: number) => {
          if (index === chamadoIndex) {
            return {
              ...chamado,
              subChamados: chamado.subChamados.filter(
                (_: any, i: number) => i !== subChamadoIndex
              ),
            };
          }
          return chamado;
        }
      );

      return { ...prevValores, chamados: novosChamados };
    });
    if (chamadoIndex === editChamadoIndex && subChamadoIndex === editSubChamadoIndex) {
      resetForm()
    }
  };
  const handleUpdateSubChamado = () => {
    if (!validateForm(chamados)) {
      return;
    }

    if (editChamadoIndex !== null && editSubChamadoIndex !== null) {
      const novosChamados = [...valores.chamados];
      novosChamados[editChamadoIndex].subChamados[editSubChamadoIndex] = {
        ...chamados,
      };

      setValores({ ...valores, chamados: novosChamados });
      setEditChamadoIndex(null);
      setEditSubChamadoIndex(null);
      setChamados({});
    }

  };
  const handleSaveDraft = () => {
    let values = chamados
    if (valores.chamados) {
      values = valores.chamados[0]
    }
    if (!validateForm(values)) {
      return;
    }

    setValores((prevValores: any) => ({
      ...prevValores,
      chamados: [
        ...(prevValores.chamados || []), // <- corrigido aqui
        {
          rascunho: true, // <- corrigido de "rescunho" para "rascunho"
          ...chamados,
        },
      ],
    }));
    setMensagem("Chamado salvo como rascunho!");
    viewSubChamado && setViewSubChamado(!viewSubChamado);
    resetForm();
  };

  const handleEditSubChamado = (chamadoIndex: number, subIndex: number) => {
    const subChamadoSelecionado =
      valores.chamados[chamadoIndex].subChamados[subIndex];

    setChamados(subChamadoSelecionado);
    setEditChamadoIndex(chamadoIndex);
    setEditSubChamadoIndex(subIndex);
  };

  const onChange = (e: any) => {
    if (e.target.name === "tipo") {
      setTipoSelecionado(e.target.value);
    }

    setChamados({ ...chamados, [e.target.name]: e.target.value });
  };
  return {
    camposDinamicos,
    chamados,
    dataAtual,
    dataSolicitacao,
    editChamadoIndex,
    editSubChamadoIndex,
    error,
    setError,
    mensagem,
    setMensagem,
    equipamentos,
    fileInputRef,
    valores,
    local,
    formatarCampo,
    handleAddChamado,
    handleAddSubChamado,
    handleClick,
    handleDeleteSubChamado,
    handleEditSubChamado,
    handleSubmit,
    viewSubChamado,
    handleUpdateSubChamado,
    onChange,
    validateForm,
    resetForm,
    handleSaveDraft,
  };
};

export default useTicket;
