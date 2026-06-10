import React, { useState, useCallback, useEffect } from "react";
import * as S from "../../FrontEnd/styles/createrequest.style";
import Topo from "../components/topo";
import MenuAdmin from "../components/menuAdmin";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import useAuth from "../services/auth/useAuth";
import { cadastroTipoSolicitacao } from "../services/cadastros/cadastroTipoSolicitacao";
import { buscarTipoSolicitacao } from "../services/Buscas/buscarTipoSolicitacao";
import { atualizarTipoSolicitacao } from "../services/atualizacoes/atualizaTipoSolicitacao";
import { set } from "zod";
import { CircularProgress } from "@mui/material";
import { TbTagPlus } from "react-icons/tb";

const CreateRequest = () => {
  const [formData, setFormData] = useState({ nome: "", descricao: "" });
  const { usuario } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<
    { id: number; nome: string; descricao: string; st_ativo: boolean }[]
  >([]);

  const [camposObrigatorios, setCamposObrigatorios] = useState({
    dataHora: false,
    quantidadeCadeiras: false,
    servirCafe: false,
  });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const visible = [
    { key: "id", label: "ID" },
    { key: "nome", label: "NOME" },
    { key: "st_ativo", label: "AÇÕES" }, // <- chave usada para ordenar
  ];

  interface RequestResponse {
    id: number;
    nome: string;
    st_ativo: boolean;
    reativado?: boolean; // Novo campo para identificar reativações
  }

  // Lidar com mudanças no formulário
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Lidar com mudanças nos checkboxes
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setCamposObrigatorios((prev) => ({ ...prev, [name]: checked }));
    },
    []
  );

  // Alternar status do solicitacoes (Ativar/Desativar)
  const toggleStatus = useCallback(async (id: number, statusAtual: boolean) => {
    try {
      const novoStatus = !statusAtual;

      // Atualização otimista
      setSolicitacoes(prev => prev.map(solicitacoes =>
        solicitacoes.id === id ? { ...solicitacoes, st_ativo: novoStatus } : solicitacoes
      ));

      await atualizarTipoSolicitacao(id, novoStatus);

    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
        setError((err as { error: string }).error);
      } else {
        setError("Erro desconhecido");
      }
      // Rollback em caso de erro
      setSolicitacoes(prev => prev.map(solicitacoes =>
        solicitacoes.id === id ? { ...solicitacoes, st_ativo: statusAtual } : solicitacoes
      ));
    }
  }, []);

  // Adicionar nova tipo de chamado
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setMensagem(null);
      const { nome, descricao } = formData;

      if (!nome || !descricao) {
        setMensagem("Por favor, preencha todos os campos obrigatórios!")
        return;
      }
      try {
        // Verificar se já existe solicitacao (ativo ou inativo)
        const solicitacaoExistente = solicitacoes.find(
          s => s.nome.toLowerCase() === nome.toLowerCase()
        );

        if (solicitacaoExistente) {
          if (!solicitacaoExistente.st_ativo) {
            // Se existir inativo: reativar
            await toggleStatus(solicitacaoExistente.id, solicitacaoExistente.st_ativo);
            setMensagem("Tipo de solicitação reativada com sucesso!");
          } else {
            // Se já existir ativo: mostrar erro
            setError("Este tipo de solicitação já está cadastrada e ativo!");
          }
        } else {
          // Cadastrar novo solicitacao com status ativo
          const response = await cadastroTipoSolicitacao(nome, descricao, camposObrigatorios.dataHora, camposObrigatorios.quantidadeCadeiras, camposObrigatorios.servirCafe);
          setSolicitacoes(prev => [
            ...prev,
            {
              id: response.id,
              nome: response.nome,
              descricao: descricao, // Ensure descricao is included
              st_ativo: true, // Garante status ativo
            }
          ]);

          setMensagem("Tipo de solicitacao cadastrado com sucesso!");
        }

        setFormData({ nome: "", descricao: "" });

      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
      finally {
        setLoading(false);
      }
    },
    [formData, camposObrigatorios, solicitacoes, toggleStatus]
  );

  // Remover Chamado
  const handleRemove = useCallback((id: number) => {
    async function fetchData() {
      try {
        await atualizarTipoSolicitacao(id, false);
        setSolicitacoes((prev) =>
          prev.filter((solicitacao) => solicitacao.id !== id)
        );
        setMensagem("Tipo de Chamado removida com sucesso!");

      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await buscarTipoSolicitacao();
        const tiposArray = response.tipoExistente || [];
        console.log(tiposArray);
        setSolicitacoes(tiposArray);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
    }
    fetchData();
  }, []); // Removida a dependência `solicitacoes`

  function sortData(array: any[], field: string, order: "asc" | "desc") {
    return [...array].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === "st_ativo") {
        valA = a.st_ativo ? 1 : 0;
        valB = b.st_ativo ? 1 : 0;
      }

      if (field === "date") {
        valA = new Date(valA.split("/").reverse().join("-"));
        valB = new Date(valB.split("/").reverse().join("-"));
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleOrder = (fieldName: string) => {
    const newSortOrder =
      sortField === fieldName && sortOrder === "asc" ? "desc" : "asc";
    const sortedData = sortData(solicitacoes, fieldName, newSortOrder);
    setSolicitacoes(sortedData);
    setSortField(fieldName);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      <MenuAdmin user={usuario?.nome} matricula={usuario?.matricula} />
      <Topo name="Cadastro de Tipo de Solicitação" icon={<TbTagPlus />} />
      <S.Container>
        <S.Section>
          <div>
            <h1>Cadastro de Tipo de Solicitação</h1>
            <S.Form onSubmit={handleSubmit}>
              <S.InputGroup>
                <div>
                  <label>Nome</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Digite o nome do tipo de Chamado"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="textarea-description">
                  <label>Descrição Padrão</label>
                  <textarea
                    name="descricao"
                    placeholder="Digite o texto padrão para o tipo de Chamado (min. 10 caracteres)"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  />
                </div>
              </S.InputGroup>

              <h3>Campos Obrigatórios</h3>
              <S.CheckboxGroup>
                <label>
                  <input
                    type="checkbox"
                    name="dataHora"
                    checked={camposObrigatorios.dataHora}
                    onChange={handleCheckboxChange}
                  />
                  Data e Hora da Realização
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="quantidadeCadeiras"
                    checked={camposObrigatorios.quantidadeCadeiras}
                    onChange={handleCheckboxChange}
                  />
                  Quantidade de Cadeiras
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="servirCafe"
                    checked={camposObrigatorios.servirCafe}
                    onChange={handleCheckboxChange}
                  />
                  Servir Café
                </label>
              </S.CheckboxGroup>
              <S.ButtonSubmit
                type="submit"
                disabled={loading}
                color="primary"
                variant="contained"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Cadastrar"
                )}
              </S.ButtonSubmit>
              {mensagem && (
                <S.Alert severity="success">
                  {mensagem}
                </S.Alert>
              )}
              {error && (
                <S.Alert severity="error">
                  {error}
                </S.Alert>
              )}
            </S.Form>
          </div>
          {solicitacoes.length > 0 && (
            <div>
              <h3>Tipos de Chamados Cadastrados</h3>
              <S.Table>
                <thead>
                  {visible.map((field, index) => (
                    <th
                      onClick={() =>
                        handleOrder(field.key.toLowerCase())
                      }
                      key={index}
                      className="table-title"
                    >
                      {field.label}{" "}
                      {sortField === field.key ? (
                        sortOrder === "asc" ? (
                          <FaSortDown color="#d9d9d9" />
                        ) : (
                          <FaSortUp color="#d9d9d9" />
                        )
                      ) : null}
                    </th>
                  ))}
                </thead>
                <tbody>
                  {solicitacoes.map((solicitacao) => (
                    <tr key={solicitacao.id}>
                      <S.TableRow key={solicitacao.id} $st_ativo={solicitacao.st_ativo}>
                        <td>{solicitacao.id}</td>
                        <td>{solicitacao.nome}</td>
                        <td>
                          <S.ActiveButton $st_ativo={solicitacao.st_ativo} onClick={() => toggleStatus(solicitacao.id, solicitacao.st_ativo)}>
                            {solicitacao.st_ativo ? "Desativar" : "Ativar"}
                          </S.ActiveButton>
                        </td>
                      </S.TableRow>
                    </tr>
                  ))}
                </tbody>
              </S.Table>
            </div>
          )}
        </S.Section>
      </S.Container>
    </>
  );
};

export default CreateRequest;