import { cadastroLocal } from "../services/cadastros/cadastraLocal";
import React, { useState, useCallback, useEffect } from "react";
import * as S from "../../FrontEnd/styles/createroom.style";
import Topo from "../components/topo";
import MenuAdmin from "../components/menuAdmin";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { buscarLocal } from "../services/Buscas/buscaLocal";
import { atualizarLocal } from "../services/atualizacoes/atualizaLocal";
import useAuth from "../services/auth/useAuth";
import { set } from "zod";
import { CircularProgress } from "@mui/material";
import { MdOutlineAddLocationAlt } from "react-icons/md";

const CreateRoom = () => {
  const [error, setError] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: "" });
  const [locais, setLocais] = useState<{ id: number; nome: string; st_ativo: boolean }[]>([]);
  const { usuario } = useAuth();
  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(1);


  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const visible = [
    { key: "id", label: "ID" },
    { key: "nome", label: "NOME" },
    { key: "st_ativo", label: "AÇÕES" }, // <- chave usada para ordenar
  ];

  // Lidar com mudanças no formulário
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await buscarLocal();
        const locaisArray = response.localExistente || [];
        setLocais(locaisArray);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
          setError((err as { error: string }).error);
        } else {
          setError("Erro desconhecido");
        }
      }
    }

    fetchData();
  }, []);

  // Adicionar esta interface para tipar a resposta da API
  interface LocalResponse {
    id: number;
    nome: string;
    st_ativo: boolean;
    reativado?: boolean; // Novo campo para identificar reativações
  }

  // Alternar status do local (Ativar/Desativar)
  const toggleStatus = useCallback(async (id: number, statusAtual: boolean) => {
    try {
      const novoStatus = !statusAtual;

      // Atualização otimista
      setLocais(prev => prev.map(local =>
        local.id === id ? { ...local, st_ativo: novoStatus } : local
      ));

      await atualizarLocal(id, novoStatus);

    } catch (err: any) {
      // Rollback em caso de erro
      setLocais(prev => prev.map(local =>
        local.id === id ? { ...local, st_ativo: statusAtual } : local
      ));
      setError(err.message || "Erro ao alterar status");
    }
  }, []);

  // Adicionar novo local
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      setMensagem(null);
      const { nome } = formData;

      if (!nome.trim()) {
        setError("Por favor, preencha o campo corretamente!");
        return;
      }

      try {
        // Verificar se já existe local (ativo ou inativo)
        const localExistente = locais.find(
          l => l.nome.toLowerCase() === nome.toLowerCase()
        );

        if (localExistente) {
          if (!localExistente.st_ativo) {
            // Se existir inativo: reativar
            await toggleStatus(localExistente.id, localExistente.st_ativo);
            setMensagem("Local reativado com sucesso!");
          } else {
            // Se já existir ativo: mostrar erro
            setError("Este local já está cadastrado e ativo!");
          }
        } else {
          // Cadastrar novo local com status ativo
          const response = await cadastroLocal(nome);

          setLocais(prev => [
            ...prev,
            {
              id: response.id,
              nome: response.nome,
              st_ativo: true // Garante status ativo
            }
          ]);

          setMensagem("Local cadastrado com sucesso!");
        }

        setFormData({ nome: "" });

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
    [formData, locais, toggleStatus]
  );

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
    const sortedData = sortData(locais, fieldName, newSortOrder);
    setLocais(sortedData);
    setSortField(fieldName);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      <MenuAdmin user={usuario?.nome} matricula={usuario?.matricula} />
      <Topo name="Cadastro de Locais" icon={<MdOutlineAddLocationAlt />} />
      <S.Container>
        <S.Section>
          <div className="form-container">
            <h1>Cadastro de Locais</h1>

            <S.Form onSubmit={handleSubmit}>
              <S.InputGroup>
                <div>
                  <label>Nome do local</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Digite o nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
              </S.InputGroup>
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
          {locais.length != 0 && (
            <div>
              <h3>Locais cadastrados</h3>
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
                      {fieldName === field.key ? (
                        order === 1 ? (
                          <FaSortDown color="#d9d9d9" />
                        ) : (
                          <FaSortUp color="#d9d9d9" />
                        )
                      ) : null}
                    </th>
                  ))}
                </thead>

                <tbody>
                  {locais.map((local) => (
                    <tr key={local.id}>
                      <S.TableRow key={local.id} $st_ativo={local.st_ativo}>
                        <td>{local.id}</td>
                        <td>{local.nome}</td>
                        <td>
                          <S.ActiveButton $st_ativo={local.st_ativo} onClick={() => toggleStatus(local.id, local.st_ativo)}>
                            {local.st_ativo ? "Desativar" : "Ativar"}
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

export default CreateRoom;
