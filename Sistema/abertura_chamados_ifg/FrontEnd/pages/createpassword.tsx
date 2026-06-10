import Component from "../../FrontEnd/styles/createpassword.styles";
import React from "react";
import logo from "../public/Assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { validaToken } from "../services/auth/validaToken";
import { alterarSenha } from "../services/cadastros/alteraSenha";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function PasswordRecovery() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [matricula, setMatricula] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento

  useEffect(() => {
    if (!router.isReady) return; // Aguarda até que o router esteja pronto

    const { token, matricula } = router.query;

    if (matricula) {
      setMatricula(matricula as string);

      const validacaoToken = async () => {
        try {
          const data = await validaToken(token as string, matricula as string);

          if (!data.ok) {
            router.replace("/login");
          }
        } catch (err: unknown) {
          if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
            setError((err as { error: string }).error);
          } else {
            setError("Erro desconhecido");
          }
        }
      };

      validacaoToken();
    }
  }, [router]); // Inclua `router` para evitar o alerta do ESLint

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null); // Limpar mensagens de erro anteriores
    try {

      const data = await alterarSenha(senha, confirmSenha, matricula);

      if (data.ok) {
        setMensagem(
          "Sua senha foi alterada com sucesso! Você será redirecionado para a tela de login!"
        );
        setTimeout(() => {
          router.push("/login");
        }, 10000);
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
        setError((err as { error: string }).error);
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Component>
      <div className="container">
        <Image src={logo} alt="logo" />

        <form onSubmit={handleSubmit}>
          <h2>Criação de senha</h2>
          <div className="text"></div>

          <div className="inputs">
            <div>
              <label>
                Nova Senha:
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </label>
              <label>
                Confirmar Senha:
                <input
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="Component.button"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>
        </form>
        {error && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <Alert
              severity="error"
            >
              {error}
            </Alert>
          </div>
        )}
        {mensagem && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <Alert
              severity="success"
            >
              {mensagem}
            </Alert>
          </div>
        )}
      </div>
    </Component>
  );
}
