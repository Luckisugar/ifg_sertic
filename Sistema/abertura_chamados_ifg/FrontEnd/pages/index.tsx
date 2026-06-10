import { useState } from "react";
import Component from "../styles/login.styles";
import logo from '../public/Assets/logo.png'
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "../services/auth/login";

export default function LoginPage() {
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpar mensagens de erro anteriores 

    try {
      
      const data= await login(registration, password);
      
      //router.push(tipoUsuario === "Gerente" ? "/admin" : "/home");
      router.push(data.tipoUsuario === "ADMIN" ? "/home" : "/createuser");
       
    } catch (err) {
      setError((err as Error).message);
    }
  };
  

  return (
    <Component >
      <div className="container">
      <Image src={logo} alt="logo"/>

      <form onSubmit={handleSubmit} >
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
      <button type="submit">Entrar</button>
      
      </form>

      {error && <p className="error">{error}</p>}
      </div>
    </Component>
  );
}
