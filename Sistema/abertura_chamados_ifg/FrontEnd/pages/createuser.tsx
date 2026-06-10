import React, { useState } from "react";
import * as S from "../../FrontEnd/styles/createuser.style";
import Topo from "../components/topo";
import MenuAdmin from "../components/menuAdmin";
import { register } from "../services/cadastros/cadastroUsuario";
import { LuUserPlus } from "react-icons/lu";
import useAuth from "../services/auth/useAuth";
import { CircularProgress } from "@mui/material";
export default function CadastroUsuario() {
  const [error, setError] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  // Uso de um único estado para os campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    email: "",
    tipoUsuario: "",
  });

  // Função para lidar com mudanças em campos do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para validação e submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setMensagem(null);
    const { nome, matricula, email, tipoUsuario } = formData;

    if (!nome || !matricula || !email || !tipoUsuario) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await register(nome, matricula, email, tipoUsuario);
      setMensagem("Usuário cadastrado com sucesso!");
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
  };
  return (
    <>
      <MenuAdmin user={usuario?.nome} matricula={usuario?.matricula} />
      <Topo name="Cadastro de Usuário" icon={<LuUserPlus />} />
      <S.Container>
        <h1>Cadastro de Usuário</h1>

        <S.Form onSubmit={handleSubmit}>
          <S.InputGroup>
            <label htmlFor="nome">Nome completo:</label>
            <input
              type="text"
              name="nome"
              placeholder="Digite o nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </S.InputGroup>
          <S.InputGroup>
            <label htmlFor="matricula">Matrícula:</label>
            <input
              type="text"
              name="matricula"
              placeholder="Digite o nº da matrícula"
              value={formData.matricula}
              onChange={handleChange}
              required
            />
          </S.InputGroup>
          <S.InputGroup>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Digite o email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </S.InputGroup>
          <S.InputGroup>
            <label>Tipo de usuário:</label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo de usuário</option>
              <option value="ADMIN">Administrador</option>
              <option value="ENCARREGADO">Encarregado</option>
            </select>
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
            <S.Alert severity="success" sx={{ width: "100%", px: 2 }}>
              {mensagem}
            </S.Alert>
          )}
          {error && (
            <S.Alert severity="error" sx={{ width: "100%", px: 2 }}>
              {error}
            </S.Alert>
          )}
        </S.Form>
      </S.Container>
    </>
  );
}
