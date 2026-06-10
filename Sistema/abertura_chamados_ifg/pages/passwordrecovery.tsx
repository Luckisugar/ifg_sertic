import Component from "@/styles/passwordRecovery.styles";
import React, { useState } from "react";
import logo from '../public/Assets/logo.png'
import Image from 'next/image';
import { useRouter } from "next/router";
import { enviaEmail } from "../services/EnviarEmail/enviarEmail";

export default function PasswordRecovery() {
  
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [matricula, setMatricula] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   
       setError(null); // Limpar mensagens de erro anteriores 
   
       try {
         const response = await enviaEmail(matricula);
         //const data = await response.json();
        
         setMensagem("Link de recuperação de senha enviado! Verifique a caixa de entrada do Email "+response.email);
         
         setTimeout(() => {
          router.push("/index");
        }, 10000);
       } catch (err) {
         setError((err as Error).message);
         
       }
  };

  return (
    <Component>
      <div className="container">
      <Image src={logo} alt="logo"/>
      {mensagem && <p>{mensagem}</p>}
      <form onSubmit={handleSubmit} >
      <h2>Recuperação de senha</h2>
      <div className="text">
      <p>Informe a matricula e enviaremos o código para redefinição de senha</p>
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
      <button type="submit">Enviar o Link</button>

    
      </form>
      {error&&<p className="error">{error}</p>}
      {mensagem&&<p className="send">{mensagem}</p>}

      </div>
  </Component>
  );
};


