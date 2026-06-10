import Component from "@/styles/createpassword.styles";
import React from "react";
import logo from '../public/Assets/logo.png'
import Image from 'next/image';
import { useRouter } from "next/router";
import { validaToken } from "../services/auth/validacaoToken";
import { alterarSenha } from "../services/cadastros/alterarSenha";
import { useEffect, useState } from 'react';

export default function PasswordRecovery() {
  
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [matricula, setMatricula] = useState("");
  const [mensagem, setMensagem] = useState("");
  

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
        } catch (err) {
          setError((err as Error).message);
        }
      };

      validacaoToken();
    }
  }, [router]);  // Inclua `router` para evitar o alerta do ESLint
   
  

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   
       setError(null); // Limpar mensagens de erro anteriores 
       try {
             
        const data= await alterarSenha(senha, confirmSenha,matricula);
        
        if(data.ok){
          setMensagem("Sua senha foi alterada com sucesso! Você será redirecionado para a tela de login!")
         setTimeout(() => {
           router.push("/index");
         }, 10000);
        }
         
      } catch (err) {
        setError((err as Error).message);
      }
   
  };
 

  return (
    <Component>
      <div className="container">
      <Image src={logo} alt="logo"/>

      <form onSubmit={handleSubmit} >
      {mensagem && <p className="success">{mensagem}</p>}
      <h2>Criação de senha</h2>
      <div className="text">
      </div>
    
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
      <button type="submit">Criar</button>
      {error && <p className="error">{error}</p>}
      </form>
      </div>
  </Component>
  );
};


