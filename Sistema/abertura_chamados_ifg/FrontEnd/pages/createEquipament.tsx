import MenuAdmin from "../components/menuAdmin";
// import Component from "../styles/createEquipament.styles";
import { RiToolsFill } from "react-icons/ri";
import Topo from "../components/topo";
import * as S from "../../FrontEnd/styles/createEquipament.styles";

import { useCallback, useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import useAuth from "../services/auth/useAuth";
import TableRegisters from "../components/tableRegisters";
import { atualizarEquipamento } from "../services/atualizacoes/atualizarEquipamento";
import { cadastroEquipamento } from "../services/cadastros/cadastroEquipamento";
import { buscarEquipamento } from "../services/Buscas/buscarEquipamento";
import { CircularProgress } from "@mui/material";

import { set } from "zod";

export default function Equipament() {
  const [equipaments, setEquipaments] = useState<
    { id: number; nome: string; st_ativo: boolean }[]
  >([]);
  const [newEquipament, setNewEquipament] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();
  const [order, setOrder] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const visible = [
    { key: "id", label: "ID" },
    { key: "nome", label: "NOME" },
    { key: "st_ativo", label: "AÇÕES" }, // <- chave usada para ordenar
  ];

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
  }, []);

  interface EquipamentoResponse {
    id: number;
    nome: string;
    st_ativo: boolean;
    reativado?: boolean; // Novo campo para identificar reativações
  }

  const toggleStatus = useCallback(async (id: number, statusAtual: boolean) => {
    try {
      const novoStatus = !statusAtual;

      // Atualização otimista
      setEquipaments((prev) =>
        prev.map((equipamento) =>
          equipamento.id === id
            ? { ...equipamento, st_ativo: novoStatus }
            : equipamento
        )
      );

      await atualizarEquipamento(id, novoStatus);
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
      // Rollback em caso de erro
      setEquipaments((prev) =>
        prev.map((equipamento) =>
          equipamento.id === id
            ? { ...equipamento, st_ativo: statusAtual }
            : equipamento
        )
      );
    }
  }, []);

  const addNewEquipament = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setMensagem(null);
      setLoading(true);
      if (!newEquipament.trim()) {
        setError("Preencha todos os campos!");
        return;
      }

      try {
        const equipamentoExistente = equipaments.find(
          (equip) => equip.nome.toLowerCase() === newEquipament.toLowerCase()
        );

        if (equipamentoExistente) {
          if (!equipamentoExistente.st_ativo) {
            await atualizarEquipamento(equipamentoExistente.id, true);

            // Atualizar equipamentomente o equipamento reativado
            setEquipaments((prevEquipaments) =>
              prevEquipaments.map((equip) =>
                equip.id === equipamentoExistente.id
                  ? { ...equip, st_ativo: true }
                  : equip
              )
            );

            setMensagem("Equipamento reativado com sucesso!");
          } else {
            setError("Equipamento já cadastrado e ativo!");
          }
        } else {
          // Cadastrar novo equipamento
          const response = await cadastroEquipamento(newEquipament);
          // Verifique se response está correto
          const { id, nome, st_ativo } = response;

          setEquipaments((prevEquipaments) => [
            ...prevEquipaments,
            {
              id,
              nome,
              st_ativo: st_ativo ?? true, // assume ativo se não vier explicitamente
            },
          ]);

          setMensagem("Equipamento cadastrado com sucesso!");
        }

        setNewEquipament(""); // Limpar o campo de input
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
      } finally {
        setLoading(false);
      }
    },
    [equipaments, newEquipament]
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
    const sortedData = sortData(equipaments, fieldName, newSortOrder);
    setEquipaments(sortedData);
    setSortField(fieldName);
    setSortOrder(newSortOrder);
  };

  return (
    <>
      <MenuAdmin user={usuario?.nome} matricula={usuario?.matricula} />
      <Topo name="Cadastro de Equipamentos" icon={<RiToolsFill />} />
      <S.Container>
        <S.Section>
          <div className="form-container">
            <h1>Cadastro de Equipamentos</h1>

            <S.Form
              onSubmit={(e) => {
                e.preventDefault();
                addNewEquipament(e);
              }}
            >
              <S.InputGroup>
                <div>
                  <label>Nome do equipamento</label>
                  <input
                    type="text"
                    placeholder="Digite o nome do equipamento"
                    value={newEquipament}
                    onChange={(e) => setNewEquipament(e.target.value)}
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
              {mensagem && <S.Alert severity="success">{mensagem}</S.Alert>}
              {error && <S.Alert severity="error">{error}</S.Alert>}
            </S.Form>
          </div>

          {equipaments.length > 0 && (
            <div>
              <h3>Equipamentos cadastrados</h3>
              <S.Table>
                <thead>
                  <tr>
                    {visible.map((field, index) => (
                      <th
                        onClick={() => handleOrder(field.key.toLowerCase())}
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
                  </tr>
                </thead>
                <tbody>
                  {equipaments.map((equip) => (
                    <tr key={equip.id}>
                      <S.TableRow key={equip.id} $st_ativo={equip.st_ativo}>
                        <td>{equip.id}</td>
                        <td>{equip.nome}</td>
                        <td>
                          <S.ActiveButton
                            $st_ativo={equip.st_ativo}
                            onClick={() =>
                              toggleStatus(equip.id, equip.st_ativo)
                            }
                          >
                            {equip.st_ativo ? "Desativar" : "Ativar"}
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
}
