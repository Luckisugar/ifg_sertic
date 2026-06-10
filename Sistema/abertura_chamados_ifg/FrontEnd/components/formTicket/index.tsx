import { CiCirclePlus } from "react-icons/ci";
import { Alert, Box, Collapse } from '@mui/material';
import { useEffect, useState } from "react";
import { buscarEquipamento } from "../../services/Buscas/buscaEquipamento";
import { buscarLocal } from "../../services/Buscas/buscaLocal";
import { buscarTiposSolicitacaoAtiva } from "../../services/solicitacoes/buscaTipoSolicitacaoAtiva";
import { cadastraSolicitacao } from "../../services/solicitacoes/cadastraSolicitacao";

interface Select1Props {
  value: string;
  onChange: (e: any) => void;
  options: any[];
}
interface Select3Props {
  value: string;
  onChange: (e: any) => void;
  options: any[];
}
interface Select4Props {
  value: string;
  onChange: (e: any) => void;
  options: any[];
}
// interface Select5Props {
//   value: string;
// }
interface Select2Props {
  value: string;
  handleSubmit: (e: any) => void;
  options: any[];
}
interface Input1Props {
  value: string;
  onChange: (e: any) => void;
}
interface Input2Props {
  value: string;
  handleSubmit: (e: any) => void;
}

interface TextArea1Props {
  value: string;
  onChange: (e: any) => void;
}
type formListProps = {
  camposDinamicos: string[];
  chamados: any[];
  dataAtual: string;
  dataSolicitacao: any[];
  equipamento: any[];
  local: any[];
  editChamadoIndex: number | null;
  editSubChamadoIndex: number | null;
  error: string | null;
  fileInputRef: any;
  valores: any;
  mensagem: string | null;
  formatarCampo: (campo: string) => string;
  handleAddChamado: (e: any) => void;
  handleSaveDraft: () => void;
  handleAddSubChamado: (chamados: any) => void;
  handleClick: () => void;
  handleDeleteSubChamado: (
    chamadoIndex: number,
    subChamadoIndex: number
  ) => void;
  handleEditSubChamado: (chamadoIndex: number, subIndex: number) => void;
  handleUpdateSubChamado: () => void;
  handleSubmit: (e: any) => void;
  viewSubChamado: boolean;
  onChange: (e: any) => void;
  validateForm: (chamados: any) => boolean;
  resetForm: () => void;
  select1: Select1Props;
  // select5:Select5Props;
  input1: Input1Props;
  textarea1: TextArea1Props;
  select2: Select2Props;
  input2: Input2Props;
  select3: Select3Props;
  select4: Select4Props;
  input3: Input2Props;

};


export default function FormTicket(props: formListProps) {
  const [equipaments, setEquipaments] = useState<
    { id: number; nome: string; st_ativo: boolean }[]
  >([]);
  const [locals, setLocals] = useState<
    { id: number; nome: string; st_ativo: boolean }[]
  >([]);
  const [tipoSolicitacao, setTipoSolicitacao] = useState<
    { id: number; nome: string; st_ativo: boolean }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // NOVOS ESTADOS: Para controlar a visibilidade dos alerts
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await buscarEquipamento();
        const equipamentosArray = response.equipamentoExistente || [];
        setEquipaments(equipamentosArray);

      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "error" in err &&
          typeof (err as any).error === "string"
        ) {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await buscarLocal();
        const locaisArray = response.localExistente || [];
        setLocals(locaisArray);
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "error" in err &&
          typeof (err as any).error === "string"
        ) {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
    }

    fetchData();
  }, [])


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await buscarTiposSolicitacaoAtiva();
        setTipoSolicitacao(response);

      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "error" in err &&
          typeof (err as any).error === "string"
        ) {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {

        console.log(props.valores)

      }
      catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "error" in err &&
          typeof (err as any).error === "string"
        ) {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
    }
    fetchData();
  }, [])

  // useEffect para gerenciar a visibilidade dos Alerts com timer 
  useEffect(() => {
    let successTimer: NodeJS.Timeout | undefined;
    let errorTimer: NodeJS.Timeout | undefined;

    // Lógica para o alerta de sucesso
    if (props.mensagem) {
      setShowAlertSuccess(true);
      successTimer = setTimeout(() => {
        setShowAlertSuccess(false);
      }, 3000); // Exibe por 3 segundos
    } else {
      setShowAlertSuccess(false); // Esconde se a mensagem não estiver presente
    }

    // Lógica para o alerta de erro
    if (props.error) { 
      setShowAlertError(true);
      errorTimer = setTimeout(() => {
        setShowAlertError(false);
      }, 5000); // Exibe por 5 segundos
    } else {
      setShowAlertError(false); // Esconde se o erro não estiver presente
    }

    // Função de limpeza para os timers
    return () => {
      if (successTimer) {
        clearTimeout(successTimer);
      }
      if (errorTimer) {
        clearTimeout(errorTimer);
      }
    };
    // Dependências: re-executa o efeito quando props.mensagem ou props.error mudarem
  }, [props.mensagem, props.error]);
  return (
    <form className="container subChamado" id="form" >
      <label htmlFor="">
        Tipo de solicitação <span>*</span>
      </label>
      <select
        name="tipo"
        value={props.select1.value}
        onChange={props.select1.onChange}
      >
        <option value="">Selecione</option>
        {tipoSolicitacao.map((item: any) => (
          <option key={item.tipo} value={item.tipo}>
            {item.nome}
          </option>
        ))}
      </select>

      <label htmlFor="">
        Assunto <span>*</span>
      </label>
      <input
        type="text"
        name="assunto"
        value={props.input1.value}
        onChange={props.input1.onChange}
      />

      <label htmlFor="">
        Descrição <span>*</span>
      </label>
      <textarea
        name="descricao"
        id=""
        cols={30}
        rows={10}
        value={props.textarea1.value}
        onChange={props.textarea1.onChange}
      ></textarea>

      {props.camposDinamicos.map((item: any) => (

        <label key={item.nome}>

          {item.tipo != "checkbox" ? item.label : "Selecione"} <span>*</span>
          {item.tipo == "select" ? (

            <select
              name={item.nome}
              value={(props.select2.value[item.nome] as string) || ""}
              onChange={props.select2.handleSubmit}
            >
              <option value="">Selecione</option>
              {item.opcoes?.map((opcao: any, index: number) => (
                <option key={index} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          ) : item.tipo === "checkbox" ? (

            <div className="container-checkbox">
              {item.opcoes?.map((opcao: any, index: number) => (
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    name={item.nome}
                    value={opcao}
                    onChange={props.input2.handleSubmit}
                    className="checkbox"
                  />
                  <label htmlFor="" className="label-checkbox">
                    {opcao}
                  </label>
                </div>
              ))}
            </div>
          ) : item.tipo === "radio" ? (
            <div className="container-radio">
              {item.opcoes?.map((opcao: any, index: number) => (
                <div className="radio-item">
                  <input
                    type="radio"
                    name={item.nome}
                    value={opcao}
                    onChange={props.input2.handleSubmit}
                    className="radio"
                  />
                  <label htmlFor="" className="label-radio">
                    {opcao}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <input
              type={item.tipo}
              name={item.nome}
              value={(props.input3.value[item.nome] as string) || ""}
              onChange={props.input3.handleSubmit}
            />
          )}
        </label>
      ))}

      <div className="container-sub">
        <label htmlFor="">
          Local <span>*</span>
        </label>
        <select
          name="local"
          id=""
          value={props.select3.value}
          onChange={props.select3.onChange}
        >
          <option value="">Selecione</option>
          {locals.map((item: any) => (
            <option value={item.value}>{item.nome}</option>
          ))}
        </select>

        <label htmlFor="">Equipamento</label>
        <select
          name="equipamento"
          id=""
          value={props.select4.value}
          onChange={props.select4.onChange}
        >
          <option value="">Selecione</option>
          {equipaments.map((item: any) => (
            <option value={item.value}>{item.nome}</option>
          ))}
        </select>
        <label htmlFor="">Mídia</label>
        <input type="file" className="input-file" />
      </div>
      {props.viewSubChamado ? (
        <div className="buttons">
          <button
            className="button-save"
            onClick={(e) => {
              e.preventDefault();
              if (props.editSubChamadoIndex !== null) {

                props.handleUpdateSubChamado();
              } else {
                props.handleAddChamado(props.chamados);
              }
            }}
          >
            {props.editSubChamadoIndex !== null ? "Atualizar" : "Salvar"}
          </button>
        </div>
      ) : (
        <div>
          <div className="button">
            <button
              className="add-sub"
              type="submit"
              onClick={(e) => {
                props.handleAddSubChamado(e);

              }}
            >
              <CiCirclePlus size={25} />
              Adicionar subchamado
            </button>
          </div>

          <div className="button-register-container">
            <button
              className="button-register"
              onClick={(e) => {
                props.handleAddChamado(props.chamados);

              }}
              type="button"
            >
              Registrar
            </button>

            <button className="button-save-draft" type="button" onClick={(e) => props.handleSaveDraft()}>
              Salvar como rascunho
            </button>
          </div>
        </div>
      )}
      <Box sx={{ marginTop: "10px" }}>
        <Collapse in={showAlertSuccess}>
          {props.mensagem && <Alert severity="success">{props.mensagem}</Alert>}
        </Collapse>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <Collapse in={showAlertError}>
          {(props.error) && <Alert severity="error">{props.error}</Alert>}
        </Collapse>
      </Box>
    </form>
  );
}
