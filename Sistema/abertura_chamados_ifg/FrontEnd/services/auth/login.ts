export async function login(matricula: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricula, password }),
  });
  const data = await res.json();
  
  if (!res.ok){
    throw { error: data.error };
  }
  localStorage.setItem("token", data.token);
  localStorage.setItem("tipoUsuario", data.tipoUsuario);
  
  return data;
  
}

export async function getMe() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/retornaUsuario`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) {
        return { ok: false, error: "Token inválido" };
      }
  
  return res.json();
}
