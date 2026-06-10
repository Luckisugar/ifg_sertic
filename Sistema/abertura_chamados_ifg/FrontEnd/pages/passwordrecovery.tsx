import Component from "../../FrontEnd/styles/passwordRecovery.styles";
import React, { useState } from "react";
import logo from "../public/Assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { enviaEmail } from "../services/EnviarEmail/enviarEmail";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function PasswordRecovery() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [matricula, setMatricula] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null); // Limpar mensagens de erro anteriores
    setMensagem(""); // Limpar mensagens de sucesso anteriores
    setLoading(true); // Iniciar o carregamento 

    try {
      const response = await enviaEmail(matricula);
      //const data = await response.json();

      setMensagem(
        "Link de recuperação de senha enviado! Verifique a caixa de entrada do Email " +
        response.email
      );

      setTimeout(() => {
        router.push("/login");
      }, 1000);
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
    <Component>
      <div className="container">
        <Image src={logo} alt="logo" />
        <form onSubmit={handleSubmit}>
          <h2>Recuperação de senha</h2>
          <div className="text">
            <p>
              Informe a matricula e enviaremos o código para redefinição de
              senha
            </p>
          </div>

          <div className="inputs">
            <div>
              <label>
                Matricula:
                <input
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
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
