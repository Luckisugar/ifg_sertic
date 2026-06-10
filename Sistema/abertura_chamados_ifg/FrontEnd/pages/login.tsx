import { useState } from "react";
import Component from "../styles/login.styles";
import logo from "../public/Assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "../services/auth/login";
import { Alert, Button, CircularProgress } from '@mui/material';

export default function LoginPage() {
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpar mensagens de erro anteriores
    setLoading(true); // Iniciar o carregamento

    try {
      const data = await login(registration, password);
  
      //router.push(tipoUsuario === "Gerente" ? "/admin" : "/home");
      router.push(data.tipoUsuario === "ADMIN" && "/home");
    }catch (err:unknown) {
      if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
        setError((err as { error: string }).error);
      } else {
        setError("Erro inesperado. Tente novamente.");
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
          <h1>Central de suporte IFG</h1>
          <div className="inputs">
            <div>
              <label>
                Matricula:
                <input
                  type="text"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Senha:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <Link href="/passwordrecovery">Esqueci minha senha</Link>
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
              className="Component.alert"
            >
              {error}
            </Alert>
          </div>
        )}
      </div>
    </Component>
  );
}
