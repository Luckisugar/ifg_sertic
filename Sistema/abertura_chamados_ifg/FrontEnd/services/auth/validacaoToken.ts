export async function validaToken(token: string, matricula: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/validaToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, matricula }),
      });
  
      console.log("Status da resposta:", res.status);
  
      // Se a API retorna 404, tratamos como token inválido sem lançar erro
      if (res.status === 404) {
        console.warn("Token inválido ou não encontrado.");
        return { ok: false, error: "Token inválido" };
      }
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro na API:", errorData);
        return { ok: false, error: errorData.error || "Erro desconhecido na API" };
      }
  
      const data = await res.json();
      console.log("Resposta da API:", data);
  
      return { ok: true, data };
    } catch (error) {
      console.error("Erro na validação do token:", error);
      return { ok: false, error: "Erro ao validar token" };
    }
  }
  