
import nodemailer, { Transporter } from "nodemailer";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../../lib/prisma";


export async function enviarEmail(email: string, matricula: string): Promise<string | null> {
  // Usando o método `env` para obter as variáveis de ambiente

  //const pass= process.env.PASS; // Valor padrão
  const emailEnvio = process.env.EMAIL;
  const Password = process.env.EMAIL_PASSWORD;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;


  if (!emailEnvio || !Password) {
    console.error("Credenciais de email não configuradas.");
    return "Credenciais de email não configuradas.";
  }

  const transport: Transporter = nodemailer.createTransport({
  
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailEnvio,
      pass: Password,
    },
  });
  
  try {
    const token = uuidv4();
    await prisma.accessToken.create({
      data: { token, matricula },
    });
    const link = `${frontendUrl}/createpassword?matricula=${matricula}&token=${token}`; 
    console.log(link)
    await transport.sendMail({
      
      from: `IFG <${emailEnvio}>`,
      to: email,
      subject: "Nova Senha",
      html: `
        <h1>Segue o link para a criação de uma nova senha:</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}" style="color: blue; text-decoration: underline;">${link}</a>
      `,
      text: `Opa, como vai? Esse email foi enviado usando o nodemailer. Segue o link para redefinir sua senha: ${link}`,
    });
    
    console.log("Email enviado com sucesso!");
    return null;
  } catch (error: unknown) {
    // Verifica se o erro tem a propriedade 'message' e se é uma instância de Error
    if (error instanceof Error) {
      return error.message;
    } else {
      return error="Ocorreu um erro desconhecido contate o administrador";
    }
  }
}
